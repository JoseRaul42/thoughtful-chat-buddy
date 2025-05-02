
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
  localEndpoint: 'http://localhost:11434/api/chat'
};

export async function generateResponse(
  message: string, 
  config: LLMConfig = defaultLLMConfig
): Promise<LLMResponse | null> {
  try {
    if (config.provider === 'openai') {
      return await callOpenAI(message, config.apiKey || '');
    } else {
      return await callLocalLLM(message, config.localEndpoint || 'http://localhost:11434/api/chat');
    }
  } catch (error) {
    console.error('Error generating LLM response:', error);
    toast.error('Failed to get a response from the AI. Please try again later.');
    return null;
  }
}

async function callOpenAI(message: string, apiKey: string): Promise<LLMResponse> {
  if (!apiKey) {
    toast.error('OpenAI API key is not configured');
    throw new Error('OpenAI API key is not configured');
  }

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
    throw new Error(`OpenAI API error: ${response.statusText}`);
  }

  const data = await response.json();
  return {
    text: data.choices[0].message.content,
    source: 'llm'
  };
}

async function callLocalLLM(message: string, endpoint: string): Promise<LLMResponse> {
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama3', // Replace with your local model name
        messages: [
          {
            role: 'system',
            content: 'You are a helpful AI assistant for Thoughtful AI, a company that provides AI agents for healthcare automation. Be concise and helpful.'
          },
          {
            role: 'user',
            content: message
          }
        ]
      })
    });

    if (!response.ok) {
      throw new Error(`Local LLM API error: ${response.statusText}`);
    }

    const data = await response.json();
    return {
      text: data.message?.content || data.response || "I couldn't process your request.",
      source: 'llm'
    };
  } catch (error) {
    console.error('Error calling local LLM:', error);
    return {
      text: "I'm having trouble connecting to my knowledge base. Please check that the local LLM server is running, or try again later.",
      source: 'llm'
    };
  }
}
