import { getMimeType } from '../utils/mime-types';
import { readFile, stat } from 'fs/promises';
import { basename } from 'path';

type FileMetadata = {
  name: string;
  path: string;
  relativePath: string;
  sizeInBytes: number;
  lastModified: number;
  lastFetched: number;
  mimeType: string;
};

export class RepoFile {
  private metadata?: FileMetadata;
  private contents?: string;

  constructor(
    public path: string,
    public relativePath: string
  ) {}

  public async loadMetadata(): Promise<FileMetadata> {
    return stat(this.path).then(stats => {
      this.metadata = {
        name: basename(this.path),
        path: this.path,
        relativePath: this.relativePath,
        sizeInBytes: stats.size,
        lastModified: Math.floor(stats.mtimeMs),
        lastFetched: Date.now(),
        mimeType: getMimeType(this.path),
      };
      return this.metadata;
    });
  }

  public async loadLatestContents(): Promise<string> {
    try {
      if (!this.metadata || !this.contents) {
        await this.loadMetadata();
        await this.loadContents();
      } else {
        const lastModified = this.metadata.lastModified;
        await this.loadMetadata();
        const newModifiedTime = this.metadata.lastModified;

        if (lastModified < newModifiedTime) {
          await this.loadContents();
        }
      }

      return this.contents!;
    } catch (error) {
      console.error(`Error checking file stats for ${this.path}:`, error);
      throw new Error(`Error checking file stats for ${this.path}\n${error}`);
    }
  }

  private async loadContents(): Promise<string> {
    return readFile(this.path, 'utf8').then(contents => {
      this.contents = contents;
      return contents || '';
    });
  }

  public getMetadata() {
    return this.metadata;
  }

  public getContents() {
    return this.contents;
  }

  public getContentsForLlmMessage(): string {
    return `${this.relativePath}
\`\`\`${this.metadata?.mimeType}
${this.contents}
\`\`\``;
  }
}
