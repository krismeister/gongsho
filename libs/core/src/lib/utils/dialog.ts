import { RepoFileLoadResponse } from "../repo-map/repo-map";
import { getContentsForLlmMessage } from "./file";

export const fillDialog = (
  dialog: string,
  fillValues: Record<string, string>
) => {
  return dialog.replace(/{{(.*?)}}/g, (match, p1) => {
    return p1 in fillValues ? fillValues[p1] : match;
  });
};

export const deletesAndUpdates = (repoFiles: Record<string, RepoFileLoadResponse>): {
  files: string,
  deletedFiles: string,
  fileHashes: Record<string, string>,
} => {

  const fileContents: string[] = [];
  const deleted: string[] = [];
  const hashes: Record<string, string> = {};

  Object.entries(repoFiles).forEach(([relativePath, file]) => {
    if (file == null) {
      deleted.push(relativePath);
    } else {
      fileContents.push(getContentsForLlmMessage(relativePath, file.contents));
      hashes[relativePath] = file.hash;
    }
  });

  const files = fileContents.join('\n');
  const deletedFiles = deleted.join('\n');

  return {
    files,
    deletedFiles,
    fileHashes: hashes,
  }
}