import OpenAI from 'openai';
import { LLMProvider, getProviderApiKey, getProviderBaseUrl } from './config';

// Shared system prompt for all providers
export const SYSTEM_PROMPT = "You are an expert web developer AI. Your task is to generate a single, self-contained HTML file based on the user's prompt. This HTML file must include all necessary HTML structure, CSS styles within <style> tags in the <head>, and JavaScript code within <script> tags, preferably at the end of the <body>. IMPORTANT: Do NOT use markdown formatting. Do NOT wrap the code in ```html and ``` tags. Do NOT output any text or explanation before or after the HTML code. Only output the raw HTML code itself, starting with <!DOCTYPE html> and ending with </html>. Ensure the generated CSS and JavaScript are directly embedded in the HTML file.";

// Common interface for all providers
export interface LLMProviderClient {
  getModels: () => Promise<{ id: string; name: string }[]>;
  generateCode: (prompt: string, model: string, customSystemPrompt?: string | null, maxTokens?: number) => Promise<ReadableStream<Uint8Array>>;
}

// Factory function to create a provider client
export function createProviderClient(provider: LLMProvider): LLMProviderClient {
  switch (provider) {
    case LLMProvider.DEEPSEEK:
      return new OpenAICompatibleProvider(LLMProvider.DEEPSEEK);
    case LLMProvider.OPENAI_COMPATIBLE:
      return new OpenAICompatibleProvider(LLMProvider.OPENAI_COMPATIBLE);
    case LLMProvider.OLLAMA:
      return new OllamaProvider();
    case LLMProvider.LM_STUDIO:
      return new LMStudioProvider();
    default:
      throw new Error(`Unsupported provider: ${provider}`);
  }
}

// OpenAI-compatible provider (OpenAI, Kluster.ai, Mistral, etc.)
class OpenAICompatibleProvider implements LLMProviderClient {
  private client: OpenAI;
  private provider: LLMProvider;

  constructor(provider: LLMProvider) {
    this.provider = provider;
    this.client = new OpenAI({
      apiKey: getProviderApiKey(provider) || '',
      baseURL: getProviderBaseUrl(provider),
    });
  }

  async getModels() {
    // Check if API key is configured
    const apiKey = getProviderApiKey(this.provider);
    if (!apiKey) {
      throw new Error(`API key not configured for ${this.provider}. Please set it in .env.local`);
    }

    try {
      const response = await this.client.models.list();

      // Remove duplicates based on model ID
      const uniqueModels = Array.from(
        new Map(response.data.map(model => [model.id, model])).values()
      );

      return uniqueModels.map((model) => ({
        id: model.id,
        name: model.id,
      }));
    } catch (error: any) {
      // Handle authentication errors
      if (error?.status === 401) {
        throw new Error(`Authentication failed. Please check your API key for ${this.provider}`);
      }
      // Handle other errors
      if (error?.message) {
        throw new Error(`Error fetching models from ${this.provider}: ${error.message}`);
      }
      throw new Error(`Cannot connect to ${this.provider}. Please check your configuration.`);
    }
  }

  async generateCode(prompt: string, model: string, customSystemPrompt?: string | null, maxTokens?: number) {
    // Use custom system prompt if provided, otherwise use default
    const systemPromptToUse = customSystemPrompt || SYSTEM_PROMPT;

    const stream = await this.client.chat.completions.create({
      model,
      messages: [
        { role: 'system', content: systemPromptToUse },
        { role: 'user', content: prompt }
      ],
      max_tokens: maxTokens || undefined, // Use maxTokens if provided, otherwise let the API decide
      stream: true,
    });

    // Create a ReadableStream for the response
    const textEncoder = new TextEncoder();
    return new ReadableStream({
      async start(controller) {
        // Process the stream from OpenAI
        for await (const chunk of stream) {
          // Extract the text from the chunk
          const content = chunk.choices[0]?.delta?.content || '';

          // Send the text to the client
          controller.enqueue(textEncoder.encode(content));
        }
        controller.close();
      },
    });
  }
}

// Ollama Provider implementation
class OllamaProvider implements LLMProviderClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = getProviderBaseUrl(LLMProvider.OLLAMA);
  }

  async getModels() {
    try {
      // Create an AbortController for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

      try {
        const response = await fetch(`${this.baseUrl}/api/tags`, {
          signal: controller.signal,
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
          throw new Error(`Error fetching Ollama models: ${response.statusText}`);
        }

        const data = await response.json();
        if (!data.models || !Array.isArray(data.models)) {
          return [];
        }
        
        return data.models.map((model: any) => {
          const modelName = model.name || '';
          // Format model name for better display
          let displayName = modelName;
          
          // If name contains a slash, extract just the model part for cleaner display
          if (modelName.includes('/')) {
            const parts = modelName.split('/');
            displayName = parts[parts.length - 1]; // Get the last part after slash
          }
          
          // Remove tag/version for cleaner display (e.g., "qwen3-abliterated:14b" -> "qwen3-abliterated")
          if (displayName.includes(':')) {
            displayName = displayName.split(':')[0];
          }
          
          return {
            id: modelName, // Full name for API calls (e.g., "huihui_ai/qwen3-abliterated:14b")
            name: displayName, // Clean name for display (e.g., "qwen3-abliterated")
          };
        });
      } catch (fetchError: any) {
        clearTimeout(timeoutId);
        throw fetchError;
      }
    } catch (error: any) {
      // Check if it's a connection error
      if (error?.code === 'ECONNREFUSED' || error?.name === 'AbortError') {
        throw new Error('Cannot connect to Ollama. Is the server running on ' + this.baseUrl + '?');
      }
      // Re-throw with a more user-friendly message
      throw new Error('Cannot connect to Ollama. Is the server running?');
    }
  }

  async generateCode(prompt: string, model: string, customSystemPrompt?: string | null, maxTokens?: number) {
    // Use custom system prompt if provided, otherwise use default
    const systemPromptToUse = customSystemPrompt || SYSTEM_PROMPT;

    try {
      const response = await fetch(`${this.baseUrl}/api/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model,
          prompt: `${systemPromptToUse}\n\nUser request: ${prompt}`,
          stream: true,
          options: maxTokens ? { num_predict: maxTokens } : undefined, // Ollama uses num_predict for max tokens
        }),
      });

      if (!response.ok) {
        throw new Error(`Error generating code with Ollama: ${response.statusText}`);
      }

      if (!response.body) {
        throw new Error('No response received from Ollama server');
      }

      // Create a ReadableStream for the response
      const textEncoder = new TextEncoder();
      return new ReadableStream({
        async start(controller) {
          const reader = response.body!.getReader();

          try {
            while (true) {
              const { done, value } = await reader.read();

              if (done) {
                controller.close();
                break;
              }

              // Convert the chunk to text
              const chunk = new TextDecoder().decode(value);

              try {
                // Ollama returns JSON objects separated by line breaks
                const lines = chunk.split('\n').filter(line => line.trim());

                for (const line of lines) {
                  const data = JSON.parse(line);
                  if (data.response) {
                    controller.enqueue(textEncoder.encode(data.response));
                  }
                }
              } catch (e) {
                // If parsing fails, send the raw text
                controller.enqueue(textEncoder.encode(chunk));
              }
            }
          } catch (error) {
            console.error('Error reading Ollama stream:', error);
            controller.error(error);
          }
        }
      });
    } catch (error) {
      console.error('Error generating code with Ollama:', error);
      throw error;
    }
  }
}

// LM Studio Provider implementation
class LMStudioProvider implements LLMProviderClient {
  private client: OpenAI;

  constructor() {
    this.client = new OpenAI({
      apiKey: 'lm-studio', // LM Studio accepts any API key
      baseURL: getProviderBaseUrl(LLMProvider.LM_STUDIO),
    });
  }

  async getModels() {
    try {
      const response = await this.client.models.list();
      return response.data.map((model) => ({
        id: model.id,
        name: model.id,
      }));
    } catch (error: any) {
      // Check if it's a connection error
      if (error?.code === 'ECONNREFUSED' || error?.message?.includes('fetch failed')) {
        throw new Error('Cannot connect to LM Studio. Is the server running on ' + getProviderBaseUrl(LLMProvider.LM_STUDIO) + '?');
      }
      // Handle authentication errors (shouldn't happen with LM Studio, but just in case)
      if (error?.status === 401) {
        throw new Error('LM Studio authentication failed. Please check your configuration.');
      }
      throw new Error('Cannot connect to LM Studio. Is the server running?');
    }
  }

  async generateCode(prompt: string, model: string, customSystemPrompt?: string | null, maxTokens?: number) {
    // Use custom system prompt if provided, otherwise use default
    const systemPromptToUse = customSystemPrompt || SYSTEM_PROMPT;

    const stream = await this.client.chat.completions.create({
      model,
      messages: [
        { role: 'system', content: systemPromptToUse },
        { role: 'user', content: prompt }
      ],
      max_tokens: maxTokens || undefined, // Use maxTokens if provided, otherwise let the API decide
      stream: true,
    });

    // Create a ReadableStream for the response
    const textEncoder = new TextEncoder();
    return new ReadableStream({
      async start(controller) {
        // Process the stream from OpenAI
        for await (const chunk of stream) {
          // Extract the text from the chunk
          const content = chunk.choices[0]?.delta?.content || '';

          // Send the text to the client
          controller.enqueue(textEncoder.encode(content));
        }
        controller.close();
      },
    });
  }
}
