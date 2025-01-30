import { Config } from '@/config/config';
import { ModelConfig } from '@/models/model-configs';
import { RepoMap } from '@/repo-map/repo-map';
import { WholeCodebaseDialogue } from './system/whole-codebase.dialogue';
import { RepoMapDialogue } from './interstitial/repo-map.dialogue';
import { AbstractDialogue } from './abstract-dialogue';
import { AbstractAgent, AgentResponse } from '@/agents/abstract-agent';
import { UserInputDialogue } from './user-input.dialogue';
import { AssistantTextDialogue } from './agent/assistant-text.dialogue';

export enum DialogRoles {
  USER = 'user',
  SYSTEM = 'system',
  INTERSTITIAL = 'interstitial',
  ASSISTANT = 'assistant',
}

// type Dialogue = {
//   role: DialogRoles;
//   text: string;
// };

export class Conversation {
  private dialogFlow: AbstractDialogue[] = [];
  private repoMap?: RepoMap;
  private includedFiles: string[] = [];
  private dialogueQueue: AbstractDialogue[] = [];

  constructor(
    private readonly config: Config,
    private readonly agent: AbstractAgent
  ) {}

  async initConversation(config: Config) {
    this.repoMap = new RepoMap(config.projectRoot);
    await this.repoMap.buildFileMap();
  }

  async startConversation(userInput: string) {
    const systemDialogue = new WholeCodebaseDialogue();
    const repoMapDialogue = new RepoMapDialogue('', {
      repoMap: this.repoMap!.getRepoMapAstText(),
    });

    this.dialogFlow.push(systemDialogue);
    this.dialogueQueue.push(repoMapDialogue);
    this.dialogueQueue.push(new UserInputDialogue(userInput));

    this.sendNextQueueItemToAgent();
  }

  sendNextQueueItemToAgent() {
    if (this.dialogFlow.length < 1 || this.dialogueQueue.length < 1) {
      return;
    }

    // moving item from queue to flow
    const dialogue = this.dialogueQueue.shift()!;
    this.dialogFlow.push(dialogue);

    const messages = this.dialogFlow.map(item => ({
      role: item.role,
      content: [
        {
          type: 'text',
          text: item.content,
        },
      ],
    }));
    const system = messages.shift()!;
    this.agent
      .sendMessages(system.content[0].text, messages)
      .then(response => this.onAgentResponse(response));
  }

  onAgentResponse(response: AgentResponse) {
    console.log(response);
    this.dialogFlow.push(
      new AssistantTextDialogue(response.content.pop()!.text)
    );

    debugger;
    // TODO: detect if there is a interstitial dialogue that is required based on that repsponse
    // and unshift it to the dialogue queue

    if (this.dialogueQueue.length > 0) {
      this.sendNextQueueItemToAgent();
    }
  }
}
