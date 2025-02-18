import { BlockTypes, parseTextToBlocks, ReplaceBlock } from "@gongsho/text-to-blocks";
import { ChangeList, ChangeListFile, ChangeListItem, SearchReplaceBlock } from "@gongsho/types";
import { readFileSync } from "fs";
import path from "path";
import { gongshoConfig } from "../config/config";
import { RepoMap } from "../repo-map/repo-map";

export const contentToChangelist = async (content: string): Promise<ChangeList> => {
  const blocks = parseTextToBlocks(content);
  const searchReplaceBlocks = blocks.filter(block => block.type === BlockTypes.REPLACE) as ReplaceBlock[];

  const files: Record<string, ChangeListFile> = {}

  searchReplaceBlocks.forEach(block => {
    const absolutePath = path.resolve(gongshoConfig.projectRoot, block.file);
    if (files[block.file]) {
      return;
    }

    let content = '';
    try {
      content = readFileSync(absolutePath, 'utf8');
    } catch (error: unknown) {
      if ((error as { code?: string }).code === 'ENOENT') {
        console.log(`File ${absolutePath} not found, but it maybe a new file from the agent.`);
      } else {
        console.error(`Failed to read file ${absolutePath}:`, error);
        throw error;
      }
    }
    files[absolutePath] = {
      path: absolutePath,
      relativePath: block.file,
      content: content
    }
  })

  const changes: ChangeListItem[] = Object.entries(files).map(([key, value]) => {
    const relativePath = path.relative(gongshoConfig.projectRoot, key);
    return {
      file: value,
      blocks: searchReplaceBlocks.filter(block => block.file === relativePath).map(block => ({
        from: block.from,
        to: block.to,
      }))
    }
  });


  const filesForDelete: string[] = []

  changes.forEach(item => {
    if (calculateNewContent(item.file.content, item.blocks) === '') {
      filesForDelete.push(item.file.relativePath);
    }
  });


  return {
    changes,
    filesForDelete,
  }
};

const calculateNewContent = (content: string, blocks: SearchReplaceBlock[]) => {
  let newContent = content;
  for (const block of blocks) {
    newContent = newContent.replace(block.from, block.to);
  }
  return newContent;
}

export const writeChangelistToFiles = async (changelist: ChangeList) => {
  for (const item of changelist.changes) {
    try {
      const newContent = calculateNewContent(item.file.content, item.blocks);
      if (newContent.trim() == '') {
        RepoMap.deleteFiles([item.file.relativePath]);
      } else {
        RepoMap.writeFiles({ [item.file.relativePath]: newContent });
      }
    } catch (error) {
      console.error(`Failed to write changes to ${item.file.path}:`, error);
      throw error;
    }
  }
}