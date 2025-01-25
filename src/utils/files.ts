import fs from 'fs';
import path from 'path';

export const PROJECT_ROOT = path.resolve(__dirname, '..', '..', 'project');

export const getProjectFiles = () => {
  return fs.readdirSync(PROJECT_ROOT);
};

export const getProjectFileContents = (file: string) => {
  return fs.readFileSync(path.resolve(PROJECT_ROOT, file), 'utf8');
};
