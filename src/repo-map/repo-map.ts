import { readdirRecursive } from './folders';
import { RepoFile } from './repo-file';
import { relative } from 'path';

export class RepoMap {
  private fileMap: Record<string, RepoFile> = {};

  constructor(
    public readonly rootPath: string,
    public sharedFiles: string[] = []
  ) {}

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

    return Object.keys(this.fileMap).join('\n\n');
  }
}
