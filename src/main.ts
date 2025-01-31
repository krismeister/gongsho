import { getConfig } from './config/config';
import { ClaudeAgent } from './agents/claude-agent';
import { Conversation } from './dialogue/conversation';

const main = async () => {
  const config = await getConfig();
  const agent = new ClaudeAgent(config);
  const conversation = new Conversation(config, agent);
  await conversation.initConversation(config);
  conversation.startConversation(
    'I want to make the message function more friendly'
  );
};

const main2 = async () => {
  const config = await getConfig();
  const conversation = new Conversation(config, new ClaudeAgent(config));
  await conversation.initConversation(config);
  //conversation-1738289447326.yml
  conversation.initFromProject('conversation-1738289447326');
  conversation.addUserInput('can you make it less friendly?');
};

main2();
