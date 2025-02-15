// for eventual unit tests
export function core(): string {
  return 'core';
}

// Expose external interface
export { gongshoConfig } from "./config/config";
export { Conversations } from "./conversations/conversations";
export { initializeGongsho } from "./startup";
export { writeDialogChangeLogToFile } from "./utils/changelog";
