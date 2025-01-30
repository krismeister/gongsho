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

main();
