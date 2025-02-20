import { AgentModels } from "@gongsho/types";
import { ClaudeAgent } from "./claude-agent";

let claudeAgent: ClaudeAgent | null = null;

export const getAgent = (model: AgentModels) => {
  switch (model) {
    default:
      if (!claudeAgent) {
        claudeAgent = new ClaudeAgent();
      }
      return claudeAgent;
  }
};
