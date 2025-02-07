import { ClaudeAgent } from './agents/claude-agent';
import { Conversation } from './conversations/conversation';
import { AgentModelConfigs, AgentModels } from './models/model-configs';

const main = async () => {
  const agent = new ClaudeAgent(AgentModelConfigs[AgentModels.CLAUDE_3_SONNET]);
  const conversation = new Conversation('id-1');
  await conversation.loadRepoMap();
  conversation.startConversation(
    'I want to make the message function more friendly'
  );
};

const main2 = async () => {
  const conversation = new Conversation('id-2');
  await conversation.loadRepoMap();
  //conversation-1738289447326.yml
  conversation.load();
  conversation.addUserInput('can you make it less friendly?');
};

main2();
