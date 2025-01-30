import { readFile, stat } from 'fs/promises';
import { basename } from 'path';

type FileMetadata = {
  name: string;
  path: string;
  relativePath: string;
  sizeInBytes: number;
  lastModified: number;
  lastFetched: number;
};

type FileContents = {
  contents: string;
  lastFetched: number;
};

export class RepoFile {
  private metadata?: FileMetadata;
  private contents?: FileContents;

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
      };
      return this.metadata;
    });
  }

  public async loadContents(): Promise<void | FileContents> {
    return readFile(this.path, 'utf8').then(contents => {
      this.contents = {
        contents,
        lastFetched: Date.now(),
      };
    });
  }

  public getMetadata() {
    return this.metadata;
  }

  public getContents() {
    return this.contents;
  }
}
