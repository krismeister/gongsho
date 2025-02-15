
export type ChangeListFile = {
  path: string;
  relativePath: string;
  content: string;
}

export type SearchReplaceBlock = {
  from: string;
  to: string;
}

export type ChangeListItem = {
  file: ChangeListFile;
  blocks: SearchReplaceBlock[];
}

export type ChangeList = {
  changes: ChangeListItem[];
}


