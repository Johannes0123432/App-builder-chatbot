import OpenAI from "openai";

/**
 * Create an OpenAI-compatible client.
 * Works with OpenAI, xAI (Grok), Groq, Together, Fireworks, OpenRouter, etc.
 */
export function createClient(apiKey: string, baseURL?: string) {
  return new OpenAI({
    apiKey,
    baseURL: baseURL || undefined, // undefined = official OpenAI
  });
}

export const SUPPORTED_PROVIDERS = [
  { id: "openai", name: "OpenAI", baseURL: undefined, defaultModel: "gpt-4o" },
  { id: "xai", name: "xAI (Grok)", baseURL: "https://api.x.ai/v1", defaultModel: "grok-2" },
  { id: "groq", name: "Groq", baseURL: "https://api.groq.com/openai/v1", defaultModel: "llama-3.3-70b-versatile" },
  { id: "together", name: "Together AI", baseURL: "https://api.together.xyz/v1", defaultModel: "meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo" },
  { id: "openrouter", name: "OpenRouter", baseURL: "https://openrouter.ai/api/v1", defaultModel: "openai/gpt-4o" },
];
