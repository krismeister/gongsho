import path from 'path';

// export const PROJECT_ROOT = path.resolve(__dirname, '..', '..', 'project');
export const PROJECT_ROOT = path.resolve(process.cwd(), 'project');

export interface GongshoConfig {
  ANTHROPIC_API_KEY?: string;
  PROJECT_ROOT: string;
}

export const gongshoConfig: GongshoConfig = {
  ANTHROPIC_API_KEY: process.env['ANTHROPIC_API_KEY'],
  PROJECT_ROOT: PROJECT_ROOT,
};

