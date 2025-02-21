export enum AgentModels {
  CLAUDE_3_5_SONNET = 'claude-3-5-sonnet-20241022',
  CLAUDE_3_OPUS = 'claude-3-opus-20240229',
  CLAUDE_3_5_HAIKU = 'claude-3-5-haiku',
}

export type AgentModelConfig = {
  model: AgentModels;
  friendlyName: string;
  maxOutputTokens: number;
  cost: {
    inputTokensCostPerMillion: number;
    outputTokensCostPerMillion: number;
  }
  // maxInputTokens: number;
  // temperature: number;
};


// TODO: Add max inputs later. 200k is the configuration from Aider, should verify.
// const MAX_INPUT_TOKENS = 200000;

export const AgentModelConfigs: Record<AgentModels, AgentModelConfig> = {
  [AgentModels.CLAUDE_3_5_SONNET]: {
    model: AgentModels.CLAUDE_3_5_SONNET,
    friendlyName: 'Claude 3.5 Sonnet',
    maxOutputTokens: 8192,
    cost: {
      inputTokensCostPerMillion: 3.0,
      outputTokensCostPerMillion: 15.0,
    },
    // temperature: 0.5,
  },
  [AgentModels.CLAUDE_3_OPUS]: {
    model: AgentModels.CLAUDE_3_OPUS,
    friendlyName: 'Claude 3.5 Opus',
    maxOutputTokens: 4096,
    cost: {
      inputTokensCostPerMillion: 15.0,
      outputTokensCostPerMillion: 75.0,
    },
    // temperature: 0.5,
  },
  [AgentModels.CLAUDE_3_5_HAIKU]: {
    model: AgentModels.CLAUDE_3_5_HAIKU,
    friendlyName: 'Claude 3.5 Haiku',
    maxOutputTokens: 2048,
    cost: {
      inputTokensCostPerMillion: 0.80,
      outputTokensCostPerMillion: 4.0,
    },
  },
};

export const defaultAgentModel = AgentModels.CLAUDE_3_5_SONNET;