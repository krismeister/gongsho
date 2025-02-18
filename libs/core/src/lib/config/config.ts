import * as dotenv from 'dotenv';
import path from 'path';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

export const PROJECT_ROOT = path.resolve('/', process.cwd(), process.env['PROJECT_ROOT'] ?? '');
console.log('PROJECT_ROOT', PROJECT_ROOT);


yargs(hideBin(process.argv))
  .option('port', {
    description: 'The port on which the app will be running',
    default: 3030,
    type: 'number'
  })
  .option('anthropicApiKey', {
    description: 'Anthropic API key for Claude integration',
    type: 'string',
  })
  .option('maxFiles', {
    description: 'Max files used as a warning',
    default: 800,
    type: 'number',
    required: false
  })
  .option('envFile', {
    description: 'Configure with an external .env file',
    default: '.env',
    type: 'string',
    required: false
  })
  .parse()

interface CliFlags {
  port?: number;
  anthropicApiKey: string;
  maxFiles?: number;
  envFile?: string;
}

const flags = yargs.argv as unknown as CliFlags;


if (flags.envFile) {
  const envPath = path.resolve(PROJECT_ROOT, flags.envFile);
  dotenv.config({ path: envPath, debug: true })
}

interface GongshoConfig {
  anthropicApiKey: string;
  port: number;
  projectRoot: string;
  gongshoDir: string;
  maxFiles: number;
}

export const gongshoConfig: GongshoConfig = {
  anthropicApiKey: flags.anthropicApiKey ?? process.env['ANTHROPIC_API_KEY'] ?? '',
  port: flags.port ?? parseInt(process.env['PORT'] ?? '3030'),
  projectRoot: PROJECT_ROOT,
  gongshoDir: path.resolve(PROJECT_ROOT, '.gongsho'),
  maxFiles: flags.maxFiles ?? parseInt(process.env['MAX_FILES'] ?? '800'),
};

export const verifyConfig = () => {
  console.log('gongshoConfig::');
  Object.entries(gongshoConfig).forEach(([key, value]) => {
    console.log(`  Config ${key} found: ${!!value}`);
  });

  if (gongshoConfig.anthropicApiKey === '') {
    throw new Error('anthropicApiKey is missing');
  }
}



