import fs from 'fs';
import path from 'path';
import ignore from 'ignore';
import { PROJECT_ROOT } from './config';

const ig = ignore();
ig.add('.DS_Store');
ig.add('Thumbs.db');
ig.add('node_modules');

// Try to read .gongshoignore from config directory
const configIgnorePath = path.resolve(__dirname, '.gongshoignore');
// Try to read .gongshoignore from project root
const projectIgnorePath = path.resolve(PROJECT_ROOT, '.gongshoignore');

try {
  let configIgnoreContent = '';
  let projectIgnoreContent = '';

  // Read and add patterns from config directory if exists
  if (fs.existsSync(configIgnorePath)) {
    configIgnoreContent = fs.readFileSync(configIgnorePath, 'utf8');
  }

  // Read and add patterns from project root if exists
  if (fs.existsSync(projectIgnorePath)) {
    projectIgnoreContent = fs.readFileSync(projectIgnorePath, 'utf8');
  }

  (projectIgnoreContent || configIgnoreContent)
    .split('\n')
    .map((line: string) => line.trim())
    .filter((line: string) => line && !line.startsWith('#'))
    .forEach((line: string) => ig.add(line));
} catch (error) {
  console.warn(`Warning: Error reading .gongshoignore file(s): ${error}`);
}

export const shouldIgnore = (filePath: string): boolean => {
  // Convert absolute path to relative path from project root
  const relativePath = path.relative(PROJECT_ROOT, filePath);
  return ig.ignores(relativePath);
};
