import fs from 'fs';
import path from 'path';

export const PROJECT_ROOT = path.resolve(__dirname, '..', '..', 'project');

interface ModelConfig {
  apiKey: string;
  model: string;
  maxTokens: number;
  apiVersion: string;
  baseUrl: string;
}

export interface Config {
  projectRoot: string;
  claude: ModelConfig;
}

export const getConfig = (): Config => {
  const configPath = path.resolve(__dirname, './env_config.json');

  try {
    const configFile = fs.readFileSync(configPath, 'utf8');
    const config = JSON.parse(configFile);

    if (!config.claude?.apiKey) {
      throw new Error('Claude API key not found in config.json');
    }

    return {
      projectRoot: PROJECT_ROOT,
      claude: { ...config.claude },
    };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to load config: ${error.message}`);
    }
    throw error;
  }
};
