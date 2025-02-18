import { gongshoConfig, verifyConfig } from "./config/config";
import { Conversations } from "./conversations/conversations";
import { RepoMap } from "./repo-map/repo-map";

export const initializeGongsho = async () => {
  verifyConfig();
  await Conversations.load();
  await RepoMap.buildFileMap();

  // Debug qty of files
  const files = RepoMap.getProjectFilesList()
  const totalFiles = (files.match(/\n/g) || []).length + 1;

  if (totalFiles > gongshoConfig.maxFiles) {
    const message = `
    This project has ${totalFiles} files, which is more than gongsho was tested with.
    Please check the .gitshoignore file to see if you can reduce the number of files.
    Or run gongsho within a sub-directory of the project.
    If you are sure you want to proceed, you can set the GONGSHO_MAX_FILES_WARNING environment variable to a larger number.
    `
    throw new Error(message)
  }

}
