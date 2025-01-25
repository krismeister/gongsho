import fs from 'fs';
import path from 'path';

interface ClaudeConfig {
  anthropicApiKey: string;
  model: string;
  maxTokens: number;
  apiVersion: string;
  baseUrl: string;
}

export const getConfig = (): { claude: ClaudeConfig } => {
  const configPath = path.resolve(__dirname, './env_config.json');

  try {
    const configFile = fs.readFileSync(configPath, 'utf8');
    const config = JSON.parse(configFile);

    if (!config.claude?.anthropicApiKey) {
      throw new Error('Claude API key not found in config.json');
    }

    return {
      claude: { ...config.claude },
    };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to load config: ${error.message}`);
    }
    throw error;
  }
};
