// AI Provider integration for AI Trading Benchmark

export interface TradeDecision {
  action: 'buy' | 'sell' | 'hold';
  quantity: number;
  reasoning?: string;
  confidence?: number;
}

interface ModelConfig {
  provider: 'openai' | 'anthropic' | 'google' | 'xai';
  modelName: string;
}

export const MODEL_CONFIGS: Record<string, ModelConfig> = {
  // OpenAI
  'gpt-4o': { provider: 'openai', modelName: 'gpt-4o' },
  'gpt-4o-mini': { provider: 'openai', modelName: 'gpt-4o-mini' },
  'gpt-4.1-mini': { provider: 'openai', modelName: 'gpt-4.1-mini' },
  'gpt-4.1': { provider: 'openai', modelName: 'gpt-4.1' },
  // Anthropic
  'claude-sonnet-4': { provider: 'anthropic', modelName: 'claude-sonnet-4-20250514' },
  'claude-haiku-3.5': { provider: 'anthropic', modelName: 'claude-3-5-haiku-20241022' },
  'claude-opus-4': { provider: 'anthropic', modelName: 'claude-opus-4-20250514' },
  // Google
  'gemini-2.0-flash': { provider: 'google', modelName: 'gemini-2.0-flash' },
  'gemini-2.5-flash': { provider: 'google', modelName: 'gemini-2.5-flash' },
  'gemini-2.5-pro': { provider: 'google', modelName: 'gemini-2.5-pro' },
  // xAI (Grok)
  'grok-4-1-fast': { provider: 'xai', modelName: 'grok-4-1-fast-non-reasoning' },
  'grok-4-fast': { provider: 'xai', modelName: 'grok-4-fast-non-reasoning' },
  'grok-3': { provider: 'xai', modelName: 'grok-3' },
  'grok-3-mini': { provider: 'xai', modelName: 'grok-3-mini' },
};

export const AVAILABLE_MODELS = Object.keys(MODEL_CONFIGS);

async function callOpenAI(prompt: string, config: ModelConfig): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error('OPENAI_API_KEY not set');
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + apiKey,
    },
    body: JSON.stringify({
      model: config.modelName,
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3,
      max_tokens: 500,
    }),
  });
  const data = await response.json();
  return data.choices?.[0]?.message?.content || '';
}

async function callAnthropic(prompt: string, config: ModelConfig): Promise<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error('ANTHROPIC_API_KEY not set');
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: config.modelName,
      max_tokens: 500,
      messages: [{ role: 'user', content: prompt }],
    }),
  });
  const data = await response.json();
  return data.content?.[0]?.text || '';
}

async function callGoogle(prompt: string, config: ModelConfig): Promise<string> {
  const apiKey = process.env.GOOGLE_API_KEY;
  if (!apiKey) throw new Error('GOOGLE_API_KEY not set');
  const url = 'https://generativelanguage.googleapis.com/v1beta/models/' + config.modelName + ':generateContent?key=' + apiKey;
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
    }),
  });
  const data = await response.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
}

async function callXAI(prompt: string, config: ModelConfig): Promise<string> {
  const apiKey = process.env.XAI_API_KEY;
  if (!apiKey) throw new Error('XAI_API_KEY not set');
  const response = await fetch('https://api.x.ai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + apiKey,
    },
    body: JSON.stringify({
      model: config.modelName,
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3,
      max_tokens: 500,
    }),
  });
  const data = await response.json();
  return data.choices?.[0]?.message?.content || '';
}

export async function callAI(modelId: string, prompt: string): Promise<string> {
  const config = MODEL_CONFIGS[modelId];
  if (!config) {
    throw new Error('Unknown model: ' + modelId);
  }

  switch (config.provider) {
    case 'openai':
      return await callOpenAI(prompt, config);
    case 'anthropic':
      return await callAnthropic(prompt, config);
    case 'google':
      return await callGoogle(prompt, config);
    case 'xai':
      return await callXAI(prompt, config);
    default:
      throw new Error('Unsupported provider');
  }
}

export function parseTradeDecision(response: string): TradeDecision {
  try {
    let jsonStr = response;
    if (response.includes('`')) {
      const match = response.match(/`(?:json)?\s*([\s\S]*?)`/);
      if (match) jsonStr = match[1];
    }
    const parsed = JSON.parse(jsonStr.trim());
    
    const action = ['buy', 'sell', 'hold'].includes(parsed.action) ? parsed.action : 'hold';
    const quantity = typeof parsed.quantity === 'number' ? Math.max(0, parsed.quantity) : 0;
    
    return {
      action,
      quantity,
      reasoning: parsed.reasoning || '',
      confidence: parsed.confidence,
    };
  } catch {
    return { action: 'hold', quantity: 0, reasoning: 'Failed to parse AI response' };
  }
}
