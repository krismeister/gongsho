import { mkdirSync, readFileSync, unlinkSync, writeFileSync } from 'fs';
import path, { relative } from 'path';
import { gongshoConfig } from '../config/config';
import { calculateChecksum } from '../utils/file';
import { readdirRecursive } from './folders';


type SimpleRepoFile = {
  relativePath: string;
  contents?: string;
  hash?: string;
}

export type RepoFileLoadResponse = SimpleRepoFile & { contents: string, hash: string } | null;

class RepoMapBase {
  private simpleFileMap: Record<string, SimpleRepoFile> = {};

  public constructor(
    public readonly rootPath: string
  ) { }

  public async buildFileMap(): Promise<Record<string, SimpleRepoFile>> {
    const allFiles = await readdirRecursive(this.rootPath);

    for (const filePath of allFiles) {
      const relativePath = relative(this.rootPath, filePath);
      this.simpleFileMap[relativePath] = {
        relativePath
      };
    }

    return this.simpleFileMap;
  }

  public getProjectFilesList() {
    return Object.keys(this.simpleFileMap).join('\n');
  }

  public getFile(relativeFilePath: string): SimpleRepoFile | null {
    if (!this.simpleFileMap[relativeFilePath]) {
      return null
    }
    return this.simpleFileMap[relativeFilePath];
  }

  public async loadContents(
    relativeFilePaths: string[]
  ): Promise<Record<string, RepoFileLoadResponse>> {
    const fileContents: Record<string, RepoFileLoadResponse> = {};
    const loadPromises = relativeFilePaths.map(async filePath => {
      const file = await this.loadFileContents(filePath);
      fileContents[filePath] = file;
      if (!file) {
        delete this.simpleFileMap[filePath];
      }
    });

    await Promise.all(loadPromises);
    return fileContents;
  }

  private async loadFileContents(relativeFilePath: string): Promise<RepoFileLoadResponse> {
    const absolutePath = path.join(this.rootPath, relativeFilePath);
    try {
      const contents = readFileSync(absolutePath, 'utf8');
      const hash = calculateChecksum(contents);
      if (contents.length === 0) {
        return null;
      }
      return {
        relativePath: relativeFilePath,
        contents,
        hash,
      };
    } catch (error) {
      if (error instanceof Error && error.message.includes('ENOENT')) {
        return null;
      }
      throw error;
    }
  }

  public async writeFiles(files: Record<string, string>) {
    for (const [relativePath, content] of Object.entries(files)) {
      const absolutePath = path.join(this.rootPath, relativePath);
      mkdirSync(path.dirname(absolutePath), { recursive: true });
      writeFileSync(absolutePath, content, 'utf8');
    }
    await this.loadContents(Object.keys(files));
  }


  public deleteFiles(relativePaths: string[]) {
    for (const relativePath of relativePaths) {
      const absolutePath = path.join(this.rootPath, relativePath);
      try {
        unlinkSync(absolutePath);
      } catch (error) {
        if (error instanceof Error && error.message.includes('ENOENT')) {
          continue;
        }
        throw error;
      }
      delete this.simpleFileMap[relativePath];
    }
  }
}

export const RepoMap = new RepoMapBase(gongshoConfig.projectRoot);