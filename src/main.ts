import { askClaude } from '@/claude/ask';
import { getFileProjectsLisp } from './utils/ast-read';
import { applyASTChanges } from './utils/ast-write';
import { RepoMap } from './repo-map/repo-map';
import { getConfig } from './config/config';
import { ClaudeAgent } from './agents/claude-agent';
import { Conversation } from './dialogue/conversation';

const main = async () => {
  const asts = getFileProjectsLisp();
  console.log(asts);
  const response = await askClaude(
    asts.join(','),
    'greet the user with a howdy and tell them what todays date is'
  );
  console.log(response);
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

const main2 = async () => {
  const config = await getConfig();
  const repo = new RepoMap(config.projectRoot);
  await repo.buildFileMap();
  console.log(repo.getRepoMapAstText());
};

const main3 = async () => {
  const config = await getConfig();
  const agent = new ClaudeAgent(config);
  const conversation = new Conversation(config, agent);
  await conversation.initConversation(config);
  conversation.startConversation('make simple.ts say goodby');
};

main3();
