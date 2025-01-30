import { relative } from 'path';

export function getFilePath(): string {
    return relative(process.cwd(), __filename);
}
