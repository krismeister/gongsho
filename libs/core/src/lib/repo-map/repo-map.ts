import { relative } from 'path';
import { gongshoConfig } from '../config/config';
import { readdirRecursive } from './folders';
import { RepoFile } from './repo-file';

export class RepoMap {
  private static instance: RepoMap | null = null;
  private fileMap: Record<string, RepoFile> = {};

  private constructor(
    public readonly rootPath: string
  ) { }

  public static getInstance(rootPath: string = gongshoConfig.PROJECT_ROOT): RepoMap {
    if (!RepoMap.instance) {
      RepoMap.instance = new RepoMap(rootPath);
    }
    return RepoMap.instance;
  }

  public async buildFileMap(): Promise<Record<string, RepoFile>> {
    const allFiles = await readdirRecursive(this.rootPath);
    this.fileMap = {};

    const fileMetaDataLoads = [];
    for (const filePath of allFiles) {
      const relativePath = relative(this.rootPath, filePath);
      const file = new RepoFile(filePath, relativePath);
      this.fileMap[relativePath] = file;
      fileMetaDataLoads.push(file.loadMetadata());
    }

    await Promise.all(fileMetaDataLoads);
    return this.fileMap;
  }

  public getRepoMapAstText() {
    for (const file of Object.values(this.fileMap)) {
      console.log(file.getMetadata());
    }

    return Object.keys(this.fileMap).join('\n');
  }

  public async loadContents(
    relativeFilePaths: string[]
  ): Promise<Record<string, RepoFile>> {
    const fileContents: Record<string, RepoFile> = {};
    const loadPromises = relativeFilePaths.map(async filePath => {
      fileContents[filePath] = this.fileMap[filePath];
      await fileContents[filePath].loadLatestContents();
    });

    await Promise.all(loadPromises);
    return fileContents;
  }
}
