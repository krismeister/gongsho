import { askClaude } from "@/claude/ask";
import { getFileProjectsLisp } from "./utils/ast-read";
import { applyASTChanges } from "./utils/ast-write";

const main = async () => {
  const asts = getFileProjectsLisp();
  console.log(asts);
  const response = await askClaude(asts.join(','), "greet the user with a howdy and tell them what todays date is");
  console.log(response)
//   const response = '{\n' +
//         '  "changes": [\n' +
//         '    {\n' +
//         '      "filename": "simple.ts",\n' +
//         '      "changes": [\n' +
//         '        {\n' +
//         '          "type": "replace",\n' +
//         '          "startLine": 3,\n' +
//         '          "startColumn": 10,\n' +
//         '          "endLine": 3,\n' +
//         '          "endColumn": 20,\n' +
//         '          "newText": "Howdy, "\n' +
//         '        }\n' +
//         '      ]\n' +
//         '    }\n' +
//         '  ]\n' +
//         '}';
    applyASTChanges(JSON.parse(response).changes);
};

main();