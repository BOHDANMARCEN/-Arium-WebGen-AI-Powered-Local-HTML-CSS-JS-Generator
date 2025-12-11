// AI Adapter - abstraction layer for LLM calls
// Supports both local (Ollama) and remote (OpenAI-compatible) providers

export async function sendPrompt(prompt, options = {}) {
  const { provider = 'ollama', model = 'llama2', baseUrl, apiKey } = options;
  
  console.log(`🤖 AI Prompt (${provider}):`, prompt.substring(0, 200) + '...');
  
  // For now, return stub response
  // TODO: Implement actual LLM calls
  // - Local: Use Ollama API (http://localhost:11434/api/generate)
  // - Remote: Use OpenAI-compatible API
  
  return { 
    text: '[[AI response stub - implement LLM adapter]]',
    usage: { tokens: 0 }
  };
}

export async function generateHTML(prompt, options = {}) {
  const systemPrompt = `You are an expert web developer. Generate clean, semantic HTML based on the user's description. 
Return only the HTML code, no markdown formatting, no explanations.`;
  
  const fullPrompt = `${systemPrompt}\n\nUser request: ${prompt}`;
  const response = await sendPrompt(fullPrompt, options);
  
  return response.text;
}

export async function fixLayout(html, issues, options = {}) {
  const prompt = `Fix the following HTML layout issues: ${JSON.stringify(issues)}\n\nHTML:\n${html}\n\nReturn the fixed HTML.`;
  const response = await sendPrompt(prompt, options);
  
  return response.text;
}

