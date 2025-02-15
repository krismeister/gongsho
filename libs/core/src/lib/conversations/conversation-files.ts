import { RepoMap } from '../repo-map/repo-map';

interface FileRecord {
  path: string;
  relativePath: string;
  fileHash: string;
}

interface ChangedFile {
  relativePath: string;
  oldHash: string;
  newHash: string;
}

export class ConversationFiles {
  private files: Record<string, FileRecord> = {};

  async addFiles(relativePaths: string[]) {
    const fileLoadPromises: Promise<void>[] = []
    for (const relativePath of relativePaths) {
      if (!this.files[relativePath]) {
        const repoFile = RepoMap.getFile(relativePath);
        const filePromise = repoFile.loadLatestContents().then(
          () => {
            this.files[relativePath] = {
              path: repoFile.path,
              relativePath,
              fileHash: repoFile.getHash(),
            };
          }
        )
        fileLoadPromises.push(filePromise)
      }
    }
    await Promise.all(fileLoadPromises);
  }

  addFilesWithHashes(relativePaths: Record<string, string>) {
    for (const [relativePath, fileHash] of Object.entries(relativePaths)) {
      if (!this.files[relativePath]) {
        const repoFile = RepoMap.getFile(relativePath);
        this.files[relativePath] = {
          path: repoFile.path,
          relativePath,
          fileHash,
        };
      }
    }
  }

  async getChangedFiles(): Promise<ChangedFile[]> {
    const changedFiles: ChangedFile[] = [];

    const fileLoadPromises: Promise<void>[] = [];
    for (const file of Object.values(this.files)) {
      const repoFile = RepoMap.getFile(file.relativePath);


      const filePromise = repoFile.loadLatestContents().then(() => {
        const currentHash = repoFile.getHash();
        if (currentHash !== file.fileHash) {
          changedFiles.push({
            relativePath: file.relativePath,
            oldHash: file.fileHash,
            newHash: currentHash,
          });
        }
      });

      fileLoadPromises.push(filePromise);
    }

    await Promise.all(fileLoadPromises);

    return changedFiles;
  }

  applyChanges(changedFiles: ChangedFile[]): void {
    for (const change of changedFiles) {
      if (this.files[change.relativePath]) {
        this.files[change.relativePath].fileHash = change.newHash;
      }
    }
  }

  getFiles(): Record<string, string> {
    return Object.fromEntries(Object.entries(this.files)
      .map(([relativePath, file]) => [
        relativePath,
        file.fileHash
      ]));
  }
}
