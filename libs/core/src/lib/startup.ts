import { verifyConfig } from "./config/config";
import { Conversations } from "./conversations/conversations";
import { RepoMap } from "./repo-map/repo-map";

export const initializeGongsho = async () => {
  verifyConfig();
  await Conversations.load();
  await RepoMap.buildFileMap();
}
