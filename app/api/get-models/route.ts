import { NextRequest, NextResponse } from 'next/server';
import { LLMProvider, getAvailableProviders } from '@/lib/providers/config';
import { createProviderClient } from '@/lib/providers/provider';

export async function GET(request: NextRequest) {
  try {
    // Get the provider from the request or use the default provider
    const searchParams = request.nextUrl.searchParams;
    const providerParam = searchParams.get('provider');

    let provider: LLMProvider;

    if (providerParam && Object.values(LLMProvider).includes(providerParam as LLMProvider)) {
      provider = providerParam as LLMProvider;
    } else {
      // Use the default provider from environment variables or DeepSeek as fallback
      provider = (process.env.DEFAULT_PROVIDER as LLMProvider) || LLMProvider.DEEPSEEK;
    }

    // Create the provider client
    const providerClient = createProviderClient(provider);

    // Get the available models
    const models = await providerClient.getModels();

    // Return the list of models as JSON response
    return NextResponse.json(models);
  } catch (error) {
    // Only log unexpected errors, not connection errors for unconfigured providers
    const errorMessage = error instanceof Error ? error.message : 'Error fetching models';
    
    // Don't log expected connection errors (they're handled gracefully in the UI)
    if (!errorMessage.includes('Cannot connect') && !errorMessage.includes('API key not configured')) {
      console.error('Error fetching models:', error);
    }

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

// Endpoint to get available providers
export async function POST() {
  try {
    const providers = getAvailableProviders().map(provider => ({
      id: provider.id,
      name: provider.name,
      description: provider.description,
      isLocal: provider.isLocal,
    }));

    return NextResponse.json(providers);
  } catch (error) {
    console.error('Error fetching providers:', error);

    return NextResponse.json(
      { error: 'Error fetching providers' },
      { status: 500 }
    );
  }
}
