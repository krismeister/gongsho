// Define a change format that's easy for both LLMs to generate and for us to apply
import fs from "fs";
import path from "path";
import { getProjectFileContents, PROJECT_ROOT } from "./files";

interface ASTChange {
    filename: string;
    changes: {
      type: 'insert' | 'replace' | 'delete';
      startLine: number;
      startColumn: number;
      endLine?: number;
      endColumn?: number;
      newText?: string;
    }[];
  }
  
  // Example of how to apply changes
  export const applyASTChanges = (changes: ASTChange[]) => {
    for (const fileChange of changes) {
      let content = getProjectFileContents(fileChange.filename);
      const lines = content.split('\n');
      
      // Sort changes from bottom to top to avoid position shifting
      const sortedChanges = fileChange.changes.sort((a, b) => 
        b.startLine - a.startLine || b.startColumn - a.startColumn
      );
  
      for (const change of sortedChanges) {
        switch (change.type) {
          case 'replace': {
            const startIndex = getPositionIndex(lines, change.startLine, change.startColumn);
            const endIndex = getPositionIndex(lines, change.endLine!, change.endColumn!);
            content = content.slice(0, startIndex) + 
                     (change.newText || '') + 
                     content.slice(endIndex);
            break;
          }
          case 'insert': {
            const index = getPositionIndex(lines, change.startLine, change.startColumn);
            content = content.slice(0, index) + 
                     change.newText + 
                     content.slice(index);
            break;
          }
          case 'delete': {
            const startIndex = getPositionIndex(lines, change.startLine, change.startColumn);
            const endIndex = getPositionIndex(lines, change.endLine!, change.endColumn!);
            content = content.slice(0, startIndex) + content.slice(endIndex);
            break;
          }
        }
      }
      
      fs.writeFileSync(path.resolve(PROJECT_ROOT, fileChange.filename), content);
    }
  };
  
  // Helper to convert line/column to absolute position
  const getPositionIndex = (lines: string[], line: number, column: number): number => {
    let position = 0;
    for (let i = 0; i < line - 1; i++) {
      position += lines[i].length + 1; // +1 for newline
    }
    return position + column - 1;
  };