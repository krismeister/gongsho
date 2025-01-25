// const { parse } = require("@typescript-eslint/parser");
import * as TSESLintParser from '@typescript-eslint/parser';
import { getProjectFileContents } from './files';
import { getProjectFiles } from './files';
// import type { ESLintProgram } from '@typescript-eslint/parser';

// Function to generate LISP-like AST format
function generateLispAST(code: string, fileName = 'example.ts') {
  // Parse the TypeScript code into an AST
  const ast = TSESLintParser.parse(code, {
    loc: true, // Include line and column information
    range: true, // Include character range information
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: { jsx: false, globalReturn: false },
  });

  // Recursive function to traverse and format nodes
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function formatNode(node: any): string {
    if (!node) return '';

    // Extract location and optional range
    const loc = node.loc
      ? `@${node.loc.start.line}:${node.loc.start.column + 1}-${node.loc.end.line}:${node.loc.end.column + 1}`
      : '';

    switch (node.type) {
      case 'Program':
        return `(SourceFile ${loc}\n  ${node.body.map(formatNode).join('\n  ')})`;

      case 'VariableDeclaration':
        return `(VariableDeclaration ${loc} :kind "${node.kind}"\n  ${node.declarations.map(formatNode).join('\n  ')})`;

      case 'VariableDeclarator':
        return `(VariableDeclarator ${loc}\n  ${formatNode(node.id)}\n  ${formatNode(node.init)})`;

      case 'Identifier':
        return `(Identifier ${loc} "${node.name}")`;

      case 'ArrowFunctionExpression':
        return `(ArrowFunctionExpression ${loc}\n  (ParameterList ${loc}\n    ${node.params.map(formatNode).join('\n    ')})\n  ${formatNode(node.body)})`;

      case 'BlockStatement':
        return `(BlockStatement ${loc}\n  ${node.body.map(formatNode).join('\n  ')})`;

      case 'ReturnStatement':
        return `(ReturnStatement ${loc}\n  ${formatNode(node.argument)})`;

      case 'TemplateLiteral':
        return `(TemplateLiteral ${loc}\n  ${node.quasis
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .map((element: any) => formatNode(element))
          .join('\n  ')}\n  ${node.expressions.map(formatNode).join('\n  ')})`;

      case 'TemplateElement':
        return `(TemplateElement ${loc} "${node.value.raw}")`;

      case 'ExportDefaultDeclaration':
        return `(ExportDefaultDeclaration ${loc}\n  ${formatNode(node.declaration)})`;

      case 'TSTypeAnnotation':
        return `(TSTypeAnnotation ${loc} "${node.typeAnnotation.type}")`;

      case 'TSTypeReference':
        return `(TSTypeReference ${loc} "${formatNode(node.typeName)}")`;

      case 'Literal':
        return `(Literal ${loc} "${node.value}")`;

      case 'TSParameterProperty':
      case 'ObjectExpression':
      default:
        console.warn(`Unknown node type: ${node.type}`);
        return `(UnknownNodeType ${loc} type: ${node.type})`;
    }
  }

  // Start formatting from the top-level node
  return `(File "${fileName}"\n  ${formatNode(ast)})`;
}

export const getFileProjectsLisp = () => {
  const files = getProjectFiles();
  return files.map(file => {
    const contents = getProjectFileContents(file);
    return generateLispAST(contents, file);
  });
};
