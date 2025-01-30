import path from 'path';
import { readdir } from 'fs/promises';
import { shouldIgnore } from '../config/ignore';
export async function readdirRecursive(dir: string): Promise<string[]> {
  const dirents = await readdir(dir, { withFileTypes: true });
  const files: string[] = [];

  for (const dirent of dirents) {
    const itempath = path.resolve(dir, dirent.name);
    if (shouldIgnore(itempath)) {
      continue;
    }
    if (dirent.isDirectory()) {
      files.push(...(await readdirRecursive(itempath)));
    } else {
      files.push(itempath);
    }
  }

  return files;
}
