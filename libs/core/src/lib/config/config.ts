import * as dotenv from 'dotenv';
import path from 'path';



// export const PROJECT_ROOT = path.resolve(__dirname, '..', '..', 'project');
export const PROJECT_ROOT = path.resolve(process.cwd(), 'project');
console.log('PROJECT_ROOT', PROJECT_ROOT);

// by default it loads the .env file in the root of the project
// const localEnvPath = path.resolve(process.cwd(), '.env');
dotenv.config()

export interface GongshoConfig {
  ANTHROPIC_API_KEY?: string;
  PROJECT_ROOT: string;
  GONGSHO_DIR: string;
}

export const gongshoConfig: GongshoConfig = {
  ANTHROPIC_API_KEY: process.env['ANTHROPIC_API_KEY'] ?? '',
  PROJECT_ROOT: PROJECT_ROOT,
  GONGSHO_DIR: path.resolve(PROJECT_ROOT, '.gongsho'),
};

export const verifyConfig = () => {
  console.log('gongshoConfig::');
  Object.entries(gongshoConfig).forEach(([key, value]) => {
    console.log(`  Config ${key} found: ${!!value}`);
  });

  if (gongshoConfig.ANTHROPIC_API_KEY === '') {
    throw new Error('ANTHROPIC_API_KEY is missing');
  }
}



