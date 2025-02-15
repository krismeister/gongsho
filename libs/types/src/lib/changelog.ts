
export type ChangeLogFile = {
  path: string;
  relativePath: string;
  content: string;
}

export type SearchReplaceBlock = {
  from: string;
  to: string;
}

export type ChangelogItem = {
  file: ChangeLogFile;
  blocks: SearchReplaceBlock[];
}

export type Changelog = {
  changes: ChangelogItem[];
}


