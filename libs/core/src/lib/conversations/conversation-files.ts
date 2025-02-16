import { RepoMap } from '../repo-map/repo-map';

interface FileRecord {
  relativePath: string;
  fileHash: string;
}

interface ChangedFile {
  relativePath: string;
  oldHash: string;
  newHash: string;
  deleted?: boolean;
}

export class ConversationFiles {
  private files: Record<string, FileRecord> = {};

  async addFiles(relativePaths: string[]) {

    const newFiles = relativePaths.filter(relativePath => !this.files[relativePath]);

    for (const relativePath of newFiles) {
      this.files[relativePath] = {
        relativePath,
        fileHash: '',
      };
    }
  }

  addFilesWithHashes(relativePaths: Record<string, string>) {
    for (const [relativePath, fileHash] of Object.entries(relativePaths)) {
      this.files[relativePath] = {
        relativePath,
        fileHash,
      };
    }
  }

  removeFiles(relativePaths: string[]) {
    for (const relativePath of relativePaths) {
      delete this.files[relativePath];
    }
  }

  async getChangedFiles(): Promise<ChangedFile[]> {
    const changedFiles: ChangedFile[] = [];
    const latestFiles = await RepoMap.loadContents(Object.keys(this.files));

    for (const [relativePath, file] of Object.entries(latestFiles)) {
      if (!file) {
        changedFiles.push({
          relativePath,
          oldHash: '',
          newHash: '',
          deleted: true,
        });
      } else if (this.files[file.relativePath].fileHash != file.hash) {
        changedFiles.push({
          relativePath: file.relativePath,
          oldHash: this.files[file.relativePath].fileHash,
          newHash: file.hash,
        });
      }
    };
    return changedFiles;
  }

  applyChanges(changedFiles: ChangedFile[]): void {
    for (const change of changedFiles) {
      if (this.files[change.relativePath]) {
        if (change.deleted) {
          delete this.files[change.relativePath];
        } else {
          this.files[change.relativePath].fileHash = change.newHash;
        }
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
