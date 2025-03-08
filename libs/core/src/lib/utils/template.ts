import { existsSync, readFileSync } from 'fs';
import { join } from 'path';

/**
 * Loads a template file from either the direct path provided or from the assets directory
 * relative to this script.
 * @param filePath - The path to the template file
 * @returns The contents of the template file as a string
 * @throws Error if template file cannot be found in either location
 */
export function loadTemplate(filePath: string): string {

  // First try the direct path
  if (existsSync(filePath)) {
    return readFileSync(filePath, 'utf8');
  }

  // If not found, try the assets directory relative to this script
  const fileName = filePath.split('/').pop() ?? filePath;
  const assetsPath = join(__dirname, 'assets', 'tpl', fileName);

  if (existsSync(assetsPath)) {
    return readFileSync(assetsPath, 'utf8');
  }

  // If neither location has the file, throw an error
  throw new Error(`Template file not found at either:\n${filePath}\n${assetsPath}`);
}
