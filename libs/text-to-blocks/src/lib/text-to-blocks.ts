export type TextContent = {
  content: string;
  type: 'text';
}

export type ReplaceContent = {
  file: string;
  from: string;
  to: string;
  language: string;
  type: 'replace';
}

export type BashContent = {
  command: string;
  type: 'bash';
}

export type ExamineContent = {
  files: string[];
  type: 'examine';
}

export type MessageBlock = TextContent | ReplaceContent | BashContent | ExamineContent;

export const parseTextToBlocks = (message: string): MessageBlock[] => {
  const blocks: MessageBlock[] = [];

  // Look for code blocks and examine files entries
  const searchPattern = /(.+)\n```(\w+)\s*<<<<<<< SEARCH\n([\s\S]*?)=======\n([\s\S]*?)>>>>>>> REPLACE\s*```/g;

  // Add debug logging
  console.log('Input message:', JSON.stringify(message)); // This will show us exact string with escapes
  console.log('Pattern:', searchPattern.source);

  let lastIndex = 0;

  // Helper to add text block if content exists
  const addTextBlock = (content: string) => {
    const trimmed = content.trim();
    if (trimmed) {
      blocks.push({
        type: 'text',
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
    console.log('Found match:', match);
    const [fullMatch, filename, language, searchContent, replaceContent] = match;
    const matchIndex = match.index;
    allMatches.push({
      index: matchIndex,
      length: fullMatch.length,
      process: () => ({
        type: 'replace',
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
        type: 'bash',
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
        type: 'examine',
        files: filesContent.split(',').map(f => f.trim())
      })
    });
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
