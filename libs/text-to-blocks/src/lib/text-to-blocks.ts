// Define block types as a const object
export enum BlockTypes {
  TEXT = 'text',
  REPLACE = 'replace',
  BASH = 'bash',
  EXAMINE = 'examine',
  BACKTICK_CODE = 'backtick_code'
}

// Create a type from the values
export type BlockType = typeof BlockTypes[keyof typeof BlockTypes];

// Define the message block interface/type union
export interface BaseMessageBlock {
  type: BlockType;
}

export interface TextBlock extends BaseMessageBlock {
  type: typeof BlockTypes.TEXT;
  content: string;
}

export interface BashBlock extends BaseMessageBlock {
  type: typeof BlockTypes.BASH;
  command: string;
  output?: string;
}

export interface ReplaceBlock extends BaseMessageBlock {
  type: typeof BlockTypes.REPLACE;
  file: string;
  from: string;
  to: string;
  language: string;
}

export interface ExamineBlock extends BaseMessageBlock {
  type: typeof BlockTypes.EXAMINE;
  files: string[];
}

export interface BacktickCodeBlock extends BaseMessageBlock {
  type: typeof BlockTypes.BACKTICK_CODE;
  content: string;
  language: string;
}

// Union type of all possible blocks
export type MessageBlock = TextBlock | BashBlock | ReplaceBlock | ExamineBlock | BacktickCodeBlock;

export const parseTextToBlocks = (message: string): MessageBlock[] => {
  const blocks: MessageBlock[] = [];

  // Look for code blocks and examine files entries
  const searchPattern = /(.+)\n```(\w+)\s*<<<<<<< SEARCH\n([\s\S]*?)=======\n([\s\S]*?)>>>>>>> REPLACE\s*```/g;

  let lastIndex = 0;

  // Helper to add text block if content exists
  const addTextBlock = (content: string) => {
    const trimmed = content.trim();
    if (trimmed) {
      blocks.push({
        type: BlockTypes.TEXT,
        content: trimmed
      });
    }
  };

  // Find all matches and their positions
  const allMatches: Array<{
    index: number,
    length: number,
    process: () => MessageBlock
  }> = [];
  // Find replace blocks
  let match: RegExpExecArray | null;
  while ((match = searchPattern.exec(message)) !== null) {
    const [fullMatch, filename, language, searchContent, replaceContent] = match;
    const matchIndex = match.index;
    allMatches.push({
      index: matchIndex,
      length: fullMatch.length,
      process: () => ({
        type: BlockTypes.REPLACE,
        file: filename.trim(),
        from: searchContent.trim(),
        to: replaceContent.trim(),
        language: language || 'typescript'
      })
    });
  }

  // Find bash blocks
  const bashPattern = /```bash\n([\s\S]*?)```/g;
  while ((match = bashPattern.exec(message)) !== null) {
    const [fullMatch, bashContent] = match;
    allMatches.push({
      index: match.index,
      length: fullMatch.length,
      process: () => ({
        type: BlockTypes.BASH,
        command: bashContent.trim() // Add required command property
      })
    });
  }

  // Find examine files entries
  const examinePattern = /^EXAMINE_FILES:(.+)$/m;
  const examineMatches = Array.from(message.matchAll(new RegExp(examinePattern, 'gm')));
  for (const match of examineMatches) {
    const [fullMatch, filesContent] = match;
    allMatches.push({
      index: match.index,
      length: fullMatch.length,
      process: () => ({
        type: BlockTypes.EXAMINE,
        files: filesContent.split(',').map(f => f.trim())
      })
    });
  }

  // Find general backtick code blocks (should run last to not interfere with other patterns)
  const backtickPattern = /```(\w*)\n([\s\S]*?)```/g;
  while ((match = backtickPattern.exec(message)) !== null) {
    const [fullMatch, language, content] = match;
    // Skip if this match overlaps with any existing matches
    const overlaps = allMatches.some(existing =>
      (match && match.index >= existing.index && match.index < existing.index + existing.length) ||
      (match && existing.index >= match.index && existing.index < match.index + fullMatch.length)
    );
    if (!overlaps) {
      allMatches.push({
        index: match.index,
        length: fullMatch.length,
        process: () => ({
          type: BlockTypes.BACKTICK_CODE,
          content: content.trimEnd(),
          language: language || 'text'
        })
      });
    }
  }

  // Sort matches by their position in the text
  allMatches.sort((a, b) => a.index - b.index);

  // Process all matches in order
  for (const match of allMatches) {
    // Add text block for content before this match
    addTextBlock(message.slice(lastIndex, match.index));

    // Add the block itself
    blocks.push(match.process());

    lastIndex = match.index + match.length;
  }

  // Add remaining text as a text block
  addTextBlock(message.slice(lastIndex));

  return blocks;
}

// The BlockByType utility type
export type BlockByType<T extends BlockType> = Extract<MessageBlock, { type: T }>;
