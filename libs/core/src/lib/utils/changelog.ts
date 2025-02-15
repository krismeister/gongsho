import { BlockTypes, parseTextToBlocks, ReplaceBlock } from "@gongsho/text-to-blocks";
import { Changelog, ChangeLogFile, ChangelogItem, DialogueData } from "@gongsho/types";
import { readFileSync, writeFileSync } from "fs";
import path from "path";
import { gongshoConfig } from "../config/config";

export const contentToChangeLog = async (content: string): Promise<Changelog> => {
  const blocks = parseTextToBlocks(content);
  const searchReplaceBlocks = blocks.filter(block => block.type === BlockTypes.REPLACE) as ReplaceBlock[];

  const files: Record<string, ChangeLogFile> = {}

  searchReplaceBlocks.forEach(block => {
    const absolutePath = path.resolve(gongshoConfig.PROJECT_ROOT, block.file);
    if (files[block.file]) {
      return;
    }
    const content = readFileSync(absolutePath, 'utf8');
    files[absolutePath] = {
      path: absolutePath,
      relativePath: block.file,
      content: content
    }
  })

  const changeLogItems: ChangelogItem[] = Object.entries(files).map(([key, value]) => {
    const relativePath = path.relative(gongshoConfig.PROJECT_ROOT, key);
    return {
      file: value,
      blocks: searchReplaceBlocks.filter(block => block.file === relativePath).map(block => ({
        from: block.from,
        to: block.to,
      }))
    }
  });

  return {
    changes: changeLogItems
  }
};

export const writeChangeLogToFile = async (changeLog: Changelog) => {
  for (const item of changeLog.changes) {
    try {
      let newContent = item.file.content;
      for (const block of item.blocks) {
        newContent = newContent.replace(block.from, block.to);
      }
      writeFileSync(item.file.path, newContent, 'utf8');
    } catch (error) {
      console.error(`Failed to write changes to ${item.file.path}:`, error);
      throw error;
    }
  }
}


export const writeDialogChangeLogToFile = async (dialog: DialogueData) => {
  const changeLog = await contentToChangeLog(dialog.content);
  await writeChangeLogToFile(changeLog);
}