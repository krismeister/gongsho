# AST Definition

According to Cursor.sh, the preferred way to transmit ASTs is to use Lisp-Like-Expressions. The preferred way to recieve an AST is using a more comprehensive format.

## Lisp-Like-Expressions (read)

passed into the LLM text query

```
(File "simple.ts"
  (SourceFile @2:1-7:1
    (VariableDeclaration @2:1-4:3 :kind "const"
      (VariableDeclarator @2:7-4:2
        (Identifier @2:7-2:14 "message")
        (ArrowFunctionExpression @2:17-4:2
          (ParameterList @2:17-4:2
            (Identifier @2:18-2:30 "name"))
          (BlockStatement @2:35-4:2
            (ReturnStatement @3:3-3:28
              (TemplateLiteral @3:10-3:27
                (TemplateElement @3:10-3:20 "Hello, ")
                (TemplateElement @3:24-3:27 "!")
                (Identifier @3:20-3:24 "name")))))))
    (ExportDefaultDeclaration @6:1-6:24
      (Identifier @6:16-6:23 "message"))))
```

## JSON (write)
Output from the LLM message query
```
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
```