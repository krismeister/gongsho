# Gongsho core library

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
import { defaultAgentModel } from '@gongsho/types';

const createConversation = async () => {
  // this input is used as the title of the conversation
  const convSummary = await Conversations.createConversation('my conversation title');

  const conversation = await Conversations.getConversation(convSummary.id);
  conversation.addUserInput('I want to add a main class to my project.', defaultAgentModel);

  conversation.getDialogDataStream().subscribe((data) => {
    console.log(data);
  });
};

const updateConversation = async (id: string) => {
  const conversation = await Conversations.getConversation(id);
  conversation.addUserInput('can you make it less friendly?', defaultAgentModel);
};
```
