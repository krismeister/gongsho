import { parseTextToBlocks } from './text-to-blocks';

describe('parseTextToBlocks', () => {
  it('should parse a simple text block', () => {
    const input = 'This is a simple text message';
    const blocks = parseTextToBlocks(input);

    expect(blocks).toEqual([
      {
        type: 'text',
        content: 'This is a simple text message'
      }
    ]);
  });

  it('should parse a bash block', () => {
    const input = '```bash\nnpm install\nnpm run build\n```';
    const blocks = parseTextToBlocks(input);

    expect(blocks).toEqual([
      {
        type: 'bash',
        command: 'npm install\nnpm run build'
      }
    ]);
  });

  it('should parse an examine files block', () => {
    const input = 'EXAMINE_FILES:src/main.ts,src/pages/index.tsx';
    const blocks = parseTextToBlocks(input);

    expect(blocks).toEqual([
      {
        type: 'examine',
        files: ['src/main.ts', 'src/pages/index.tsx']
      }
    ]);
  });

  it('should parse a replace block', () => {
    const input = `src/simple.ts
\`\`\`javascript
<<<<<<< SEARCH
const old = () => {};
=======
const new = () => {};
>>>>>>> REPLACE
\`\`\``;

    const blocks = parseTextToBlocks(input);

    expect(blocks).toEqual([
      {
        type: 'replace',
        file: 'src/simple.ts',
        from: 'const old = () => {};',
        to: 'const new = () => {};',
        language: 'javascript'
      }
    ]);
  });

  it('should parse mixed content in correct order', () => {
    const input = `Let's make some changes.

EXAMINE_FILES:src/main.ts,src/pages/index.tsx

First, install dependencies:
\`\`\`bash
npm install
npm run build
\`\`\`

Then update the code:
simple.ts
\`\`\`typescript
<<<<<<< SEARCH
const old = () => {};
=======
const new = () => {};
>>>>>>> REPLACE
\`\`\`

That's all!`;

    const blocks = parseTextToBlocks(input);

    expect(blocks).toEqual([
      {
        type: 'text',
        content: "Let's make some changes."
      },
      {
        type: 'examine',
        files: ['src/main.ts', 'src/pages/index.tsx']
      },
      {
        type: 'text',
        content: 'First, install dependencies:'
      },
      {
        type: 'bash',
        command: 'npm install\nnpm run build'
      },
      {
        type: 'text',
        content: 'Then update the code:'
      },
      {
        type: 'replace',
        file: 'simple.ts',
        from: 'const old = () => {};',
        to: 'const new = () => {};',
        language: 'typescript'
      },
      {
        type: 'text',
        content: "That's all!"
      }
    ]);
  });

  it('should handle empty input', () => {
    const input = '';
    const blocks = parseTextToBlocks(input);
    expect(blocks).toEqual([]);
  });

  it('should handle whitespace-only input', () => {
    const input = '   \n   \t   ';
    const blocks = parseTextToBlocks(input);
    expect(blocks).toEqual([]);
  });

  it('should handle multiple consecutive replace blocks', () => {
    const input = `file1a.js
\`\`\`javascript
<<<<<<< SEARCH
const a = 1;
=======
const a = 2;
>>>>>>> REPLACE
\`\`\`
file2.ts
\`\`\`typescript
<<<<<<< SEARCH
const b = 1;
=======
const b = 2;
>>>>>>> REPLACE
\`\`\``;

    const blocks = parseTextToBlocks(input);

    expect(blocks).toEqual([
      {
        type: 'replace',
        file: 'file1a.js',
        from: 'const a = 1;',
        to: 'const a = 2;',
        language: 'javascript'
      },
      {
        type: 'replace',
        file: 'file2.ts',
        from: 'const b = 1;',
        to: 'const b = 2;',
        language: 'typescript'
      }
    ]);
  });
});
