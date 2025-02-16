import * as dotenv from 'dotenv';
import path from 'path';

export const PROJECT_ROOT = path.resolve('/', process.cwd(), process.env['PROJECT_ROOT'] ?? '');
console.log('PROJECT_ROOT', PROJECT_ROOT);

// by default it loads the .env file in the root of the project
// const localEnvPath = path.resolve(process.cwd(), '.env');
dotenv.config({ debug: true })

export interface GongshoConfig {
  ANTHROPIC_API_KEY?: string;
  PROJECT_ROOT: string;
  GONGSHO_DIR: string;
  GONGSHO_MAX_FILES_WARNING: number;
}

export const gongshoConfig: GongshoConfig = {
  ANTHROPIC_API_KEY: process.env['ANTHROPIC_API_KEY'] ?? '',
  PROJECT_ROOT: PROJECT_ROOT,
  GONGSHO_DIR: path.resolve(PROJECT_ROOT, '.gongsho'),
  GONGSHO_MAX_FILES_WARNING: parseInt(process.env['GONGSHO_MAX_FILES_WARNING'] ?? '2000'),
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



