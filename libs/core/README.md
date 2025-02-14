# gongsho core library

This library contains the core functionality of the gongsho project.

## Usage

Startup the application

```typescript
import { initializeGongsho } from '@gongsho/core';

initializeGongsho();
```

The basic usage

```typescript
import { Conversations } from '@gongsho/core';

const createConversation = async () => {
  // this input is used as the title of the conversation
  const convSummary = await Conversations.getInstance().createConversation('my conversation title');

  const conversation = await Conversations.getInstance().getConversation(convSummary.id);
  conversation.addUserInput('I want to add a main class to my project.');

  conversation.getDialogueDataStream().subscribe((data) => {
    console.log(data);
    /// then reply to the conversation
    conversation.addUserInput('can you make it less friendly?');
  });
};

const updateConversation = async (id: string) => {
  const conversation = await Conversations.getInstance().getConversation(id);
  conversation.addUserInput('can you make it less friendly?');
};
```
