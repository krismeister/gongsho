import { ASTProject } from "@/utils/ast-out";

// export const onlyDeltaASTPrompt = (ast: ASTProject, userPrompt: string): string => {
//     return `I have an AST representation of TypeScript code with detailed position information. When suggesting changes, please refer to specific node positions (pos and end values) where modifications should be made. Here's the AST:
  
//   ${JSON.stringify(ast)}
  
//   User Prompt: ${userPrompt}
  
//   Please provide:
//   1. The an array of AST changes including file names without any further explenation
//   `;
// }

// export const moreDescriptivePrompt = (ast: ASTProject, userPrompt: string): string => {
//     return `I have an AST representation of TypeScript code with detailed position information. When suggesting changes, please refer to specific node positions (pos and end values) where modifications should be made. Here's the AST:
  
//   ${JSON.stringify(ast)}
  
//   User Prompt: ${userPrompt}
  
//   Please provide:
//   1. The delta AST of the changes without any explenation
//   2. A seperator of '---'
//   2. A brief explanation of the changes you made to the code
//   3. A brief explanation of the considerations for maintaining the code structure and style.`;
//   }


export const astChangePrompt = (ast: string, userPrompt: string): string => {
    return `You are a code modification assistant. I will provide you with an AST representation of code and a requested change. Please respond with a precise change list that follows this JSON structure:
  
  {
    "changes": [
      {
        "filename": "path/to/file",
        "changes": [
          {
            "type": "replace|insert|delete",
            "startLine": <number>,
            "startColumn": <number>,
            "endLine": <number>,  // required for replace and delete
            "endColumn": <number>,  // required for replace and delete
            "newText": "string"  // required for replace and insert
          }
        ]
      }
    ]
  }
  
  Important rules:
  1. Only output valid JSON in the exact format above
  2. All line and column numbers must be positive integers
  3. For 'replace' and 'delete' operations, include both start and end positions
  4. For 'insert' operations, only startLine and startColumn are needed
  5. Multiple changes to the same file should be in the same filename group
  6. Order changes from top to bottom of the file
  
  Here is the current code structure:
  ${ast}
  
  User requested change: ${userPrompt}
  
  Respond only with the JSON change list.`;
};