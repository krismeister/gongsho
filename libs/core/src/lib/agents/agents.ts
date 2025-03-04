import { AgentModels } from "@gongsho/types";
import { AnthropicAgent } from "./claude-agent";

let claudeAgent: AnthropicAgent | null = null;

export const getAgent = (model: AgentModels) => {
  switch (model) {
    default:
      if (!claudeAgent) {
        claudeAgent = new AnthropicAgent();
      }
      return claudeAgent;
  }
};
