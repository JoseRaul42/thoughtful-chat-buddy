
import { toast } from "sonner";

export type LLMProvider = 'openai' | 'local';

export interface LLMResponse {
  text: string;
  source: 'faq' | 'llm';
}

export interface LLMConfig {
  provider: LLMProvider;
  apiKey?: string;
  localEndpoint?: string;
}

export const defaultLLMConfig: LLMConfig = {
  provider: 'local',
  localEndpoint: 'http://localhost:1234/v1/chat/completions'
};

export async function generateResponse(
  message: string, 
  config: LLMConfig = defaultLLMConfig
): Promise<LLMResponse | null> {
  try {
    if (config.provider === 'openai') {
      return await callOpenAI(message, config.apiKey || '');
    } else {
      return await callLocalLLM(message, config.localEndpoint || 'http://localhost:1234/v1/chat/completions');
    }
  } catch (error: any) {
    console.error('Error generating LLM response:', error);
    const errorMessage = error?.message || 'Failed to get a response from the AI';
    toast.error(errorMessage);
    return {
      text: `Error: ${errorMessage}. Please check your connection and settings.`,
      source: 'llm'
    };
  }
}

async function callOpenAI(message: string, apiKey: string): Promise<LLMResponse> {
  if (!apiKey) {
    const error = 'OpenAI API key is not configured';
    toast.error(error);
    return {
      text: `Error: ${error}. Please configure your API key in settings.`,
      source: 'llm'
    };
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful AI assistant for Thoughtful AI, a company that provides AI agents for healthcare automation. Be concise and helpful.'
          },
          {
            role: 'user',
            content: message
          }
        ],
        max_tokens: 150
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.error?.message || response.statusText || 'Unknown error';
      throw new Error(`OpenAI API error: ${errorMessage}`);
    }

    const data = await response.json();
    return {
      text: data.choices[0].message.content,
      source: 'llm'
    };
  } catch (error: any) {
    console.error('OpenAI API error:', error);
    throw new Error(`OpenAI API error: ${error.message}`);
  }
}

async function callLocalLLM(message: string, endpoint: string): Promise<LLMResponse> {
  if (!endpoint) {
    const error = 'Local LLM endpoint is not configured';
    toast.error(error);
    return {
      text: `Error: ${error}. Please configure your local endpoint in settings.`,
      source: 'llm'
    };
  }

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        messages: [
          {
            role: 'system',
            content: 'You are a helpful AI assistant for Thoughtful AI, a company that provides AI agents for healthcare automation. Be concise and helpful.'
          },
          {
            role: 'user',
            content: message
          }
        ],
        temperature: 0.1,
        max_tokens: 150
      })
    });

    if (!response.ok) {
      console.error('API response not ok:', response.status, response.statusText);
      throw new Error(`Local LLM API error: ${response.status} ${response.statusText || 'Unknown error'}`);
    }

    const data = await response.json();
    
    // Handle different response formats
    let content;
    if (data.choices && data.choices[0] && data.choices[0].message) {
      content = data.choices[0].message.content; // Standard OpenAI format
    } else if (data.message && data.message.content) {
      content = data.message.content; // Format used by some local models
    } else if (data.response) {
      content = data.response; // Simple response format
    } else {
      console.error('Unexpected response format:', data);
      throw new Error('Invalid response format from local LLM');
    }
    
    if (!content) {
      throw new Error('Failed to extract content from response');
    }
    
    return {
      text: content,
      source: 'llm'
    };
  } catch (error: any) {
    console.error('Error calling local LLM:', error);
    throw new Error(`Local LLM error: ${error.message}`);
  }
}
