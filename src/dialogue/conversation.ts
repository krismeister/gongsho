import { Config } from '@/config/config';
import { RepoMap } from '@/repo-map/repo-map';
import { WholeCodebaseDialogue } from './system/whole-codebase.dialogue';
import { RepoMapDialogue } from './interstitial/repo-map.dialogue';
import { AbstractDialogue } from './abstract-dialogue';
import { AbstractAgent, AgentResponse } from '@/agents/abstract-agent';
import { UserInputDialogue } from './user-input.dialogue';
import { AssistantTextDialogue } from './agent/assistant-text.dialogue';
import { AddFilesDialogue } from './interstitial/add-files.dialogue';

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

  async onAgentResponse(response: AgentResponse) {
    console.log(response);
    const content = response.content[response.content.length - 1]!.text;
    this.dialogFlow.push(new AssistantTextDialogue(content));

    if (content.includes('EXAMINE_FILES')) {
      const examineFilesRegex = /EXAMINE_FILES:(.*?)(?:\n|$)/;
      const match = content.match(examineFilesRegex);
      const files = match ? match[1].trim().split(',') : [];

      const repoFiles = await this.repoMap!.loadContents(files);

      const fileContents = Object.values(repoFiles)
        .map(file => file.getContentsForLlmMessage())
        .join('\n');

      const dialogue = new AddFilesDialogue('', {
        files: fileContents,
      });
      this.dialogueQueue.unshift(dialogue);
    }

    if (this.dialogueQueue.length > 0) {
      this.sendNextQueueItemToAgent();
    }
  }
}
