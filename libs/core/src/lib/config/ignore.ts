import fs from 'fs';
import ignore from 'ignore';
import path from 'path';
import { PROJECT_ROOT } from './config';

const ig = ignore();
ig.add('.DS_Store');
ig.add('Thumbs.db');
ig.add('node_modules');
ig.add('.gongsho');
ig.add('.gongshoignore');
ig.add('.gitignore');
ig.add('dist');
ig.add('.vscode');
ig.add('.idea');
ig.add('coverage');
ig.add('*.log');
ig.add('.angular')
ig.add('.nx')
ig.add('.git')


const gongshoIgnorePath = path.resolve(PROJECT_ROOT, '.gongshoignore');
const gitIgnorePath = path.resolve(PROJECT_ROOT, '.gitignore');

try {
  let gongshoIgnoreContent = '';
  let gitIgnoreContent = '';

  // Read and add patterns from config directory if exists
  if (fs.existsSync(gongshoIgnorePath)) {
    gongshoIgnoreContent = fs.readFileSync(gongshoIgnorePath, 'utf8');
  }

  // Read and add patterns from project root if exists
  if (fs.existsSync(gitIgnorePath)) {
    gitIgnoreContent = fs.readFileSync(gitIgnorePath, 'utf8');
  }

  ig.add(gongshoIgnoreContent || gitIgnoreContent)

} catch (error) {
  console.warn(`Warning: Error reading .gongshoignore or .gitignore file(s): ${error}`);
}

export const shouldIgnore = (filePath: string): boolean => {
  // Convert absolute path to relative path from project root
  const relativePath = path.relative(PROJECT_ROOT, filePath);
  return ig.ignores(relativePath);
};
