import { DialogData, DialogFragment, DialogRoles } from '@gongsho/types';
import { Observable, OperatorFunction, scan } from 'rxjs';
import { BlockTypes, MessageBlock } from './text-to-blocks';

interface ParsedFragment {
  complete: boolean;
  blocks: MessageBlock[];
  remainingText: string;
  currentBlock?: {
    type: BlockTypes;
    partial: string;
    language?: string;
  };
}

interface ParserState {
  buffer: string;
  inCodeBlock: boolean;
  codeBlockType: string;
}

export function parseStreamingBlocks(): OperatorFunction<DialogFragment | DialogData, ParsedFragment> {

  const initialState: ParserState = {
    buffer: '',
    inCodeBlock: false,
    codeBlockType: ''
  };

  return (source: Observable<DialogFragment | DialogData>) => source.pipe(
    scan((acc: ParsedFragment & ParserState, fragment: DialogFragment | DialogData): ParsedFragment & ParserState => {

      let completed = false;
      if (fragment.dialogRole === DialogRoles.ASSISTANT_FRAGMENT) {
        acc.buffer += fragment.content;
      } else {
        completed = true
      }

      const blocks: MessageBlock[] = [];
      let currentPosition = 0;
      let currentBlock: ParsedFragment['currentBlock'] = undefined;

      // Try to extract complete blocks
      while (currentPosition < acc.buffer.length) {
        if (!acc.inCodeBlock) {
          // Look for start of code blocks
          const codeStart = acc.buffer.indexOf('```', currentPosition);
          if (codeStart === -1) {
            // No complete code block, but we might have partial text
            const remainingText = acc.buffer.slice(currentPosition).trim();
            if (remainingText) {
              currentBlock = {
                type: BlockTypes.TEXT,
                partial: remainingText
              };
            }
            break;
          }

          // Add any text before code block
          const textContent = acc.buffer.slice(currentPosition, codeStart).trim();
          if (textContent) {
            blocks.push({
              type: BlockTypes.TEXT,
              content: textContent
            });
          }

          // Check if we have the language identifier
          const nextNewline = acc.buffer.indexOf('\n', codeStart + 3);
          if (nextNewline === -1) break; // Wait for more content

          acc.codeBlockType = acc.buffer.slice(codeStart + 3, nextNewline).trim();
          acc.inCodeBlock = true;
          currentPosition = nextNewline + 1;

        } else {
          // Look for end of code block
          const codeEnd = acc.buffer.indexOf('```', currentPosition);
          if (codeEnd === -1) {
            // Incomplete code block, expose it as current
            currentBlock = {
              type: BlockTypes.BACKTICK_CODE,
              partial: acc.buffer.slice(currentPosition),
              language: acc.codeBlockType
            };
            break;
          }

          const codeContent = acc.buffer.slice(currentPosition, codeEnd);

          // Handle different types of code blocks
          if (codeContent.includes('<<<<<<< SEARCH')) {
            // This is a replace block
            const [filename, ...rest] = acc.buffer.slice(0, currentPosition).split('\n').reverse()[0].split('\n');
            const [searchPart, replacePart] = codeContent.split('=======');

            blocks.push({
              type: BlockTypes.REPLACE,
              file: filename.trim(),
              from: searchPart.replace('<<<<<<< SEARCH\n', '').trim(),
              to: replacePart.replace('>>>>>>> REPLACE', '').trim(),
              language: acc.codeBlockType
            });
          } else if (acc.codeBlockType === 'bash') {
            blocks.push({
              type: BlockTypes.BASH,
              command: codeContent.trim()
            });
          } else {
            blocks.push({
              type: BlockTypes.BACKTICK_CODE,
              content: codeContent.trim(),
              language: acc.codeBlockType || 'text'
            });
          }

          acc.inCodeBlock = false;
          currentPosition = codeEnd + 3;
        }
      }

      // Check for EXAMINE_FILES patterns in remaining text
      const examineMatch = acc.buffer.match(/^EXAMINE_FILES:(.+)$/m);
      if (examineMatch) {
        blocks.push({
          type: BlockTypes.EXAMINE,
          files: examineMatch[1].split(',').map(f => f.trim())
        });
        acc.buffer = acc.buffer.replace(examineMatch[0], '');
      }

      // Keep any incomplete content in the buffer
      acc.buffer = acc.buffer.slice(currentPosition);

      return {
        ...acc,
        complete: completed,
        blocks,
        remainingText: acc.buffer,
        currentBlock
      };
    }, { ...initialState, complete: false, blocks: [], remainingText: '', currentBlock: undefined }),
  );
}

// Example usage:
/*
fragmentStream$.pipe(
  parseStreamingBlocks()
).subscribe(({ blocks, complete }) => {
  blocks.forEach(block => {
    switch (block.type) {
      case BlockTypes.TEXT:
        console.log('Text block:', block.content);
        break;
      case BlockTypes.REPLACE:
        console.log('Replace block:', block.file, block.from, '=>', block.to);
        break;
      // ... handle other block types
    }
  });
  
  if (complete) {
    console.log('Stream complete');
  }
});
*/ 