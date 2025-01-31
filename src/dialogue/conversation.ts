import { Config } from '@/config/config';
import { RepoMap } from '@/repo-map/repo-map';
import { WholeCodebaseDialogue } from './system/whole-codebase.dialogue';
import { RepoMapDialogue } from './interstitial/repo-map.dialogue';
import { BaseDialogue, DialogueData } from './base-dialogue';
import { AbstractAgent, AgentResponse } from '@/agents/abstract-agent';
import { UserInputDialogue } from './user-input.dialogue';
import { AssistantTextDialogue } from './agent/assistant-text.dialogue';
import { AddFilesDialogue } from './interstitial/add-files.dialogue';
import fs from 'fs';
import YAML from 'yaml';
import path from 'path';

export enum DialogRoles {
  USER = 'user',
  SYSTEM = 'system',
  INTERSTITIAL = 'interstitial',
  ASSISTANT = 'assistant',
}

export class Conversation {
  private dialogFlow: BaseDialogue[] = [];
  private repoMap?: RepoMap;
  private includedFiles: string[] = [];
  private dialogueQueue: BaseDialogue[] = [];
  private id: string;
  private agentInProgress: boolean = false;

  constructor(
    private readonly config: Config,
    private readonly agent: AbstractAgent
  ) {
    this.id = `conversation-${Date.now()}`; // Set ID when conversation is created
  }

  private saveToProject() {
    // TODO: move save and load to a seperate class.
    const filePath = `${this.config.projectRoot}/.gongsho/${this.id}.yml`;

    const dirPath = path.dirname(filePath);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }

    const dialogueData = this.dialogFlow.map(item => item.getDialogueData());
    fs.writeFileSync(filePath, YAML.stringify(dialogueData, { lineWidth: 0 }));
  }

  public initFromProject(id: string) {
    this.id = id;
    const filePath = `${this.config.projectRoot}/.gongsho/${this.id}.yml`;
    const dialogueData = YAML.parse(fs.readFileSync(filePath, 'utf8'));
    this.dialogFlow = dialogueData.map((item: DialogueData) =>
      BaseDialogue.fromDialogueData(item)
    );
  }

  async initConversation(config: Config) {
    this.repoMap = new RepoMap(config.projectRoot);
    await this.repoMap.buildFileMap();
  }

  public async addUserInput(userInput: string) {
    this.dialogueQueue.push(new UserInputDialogue(userInput));
    this.sendNextQueueItemToAgent();
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
    if (
      this.dialogFlow.length < 1 ||
      this.dialogueQueue.length < 1 ||
      this.agentInProgress
    ) {
      return;
    }

    this.agentInProgress = true;
    // moving item from queue to flow
    const dialogue = this.dialogueQueue.shift()!;
    this.dialogFlow.push(dialogue);
    this.saveToProject();

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
      .then(response => {
        this.agentInProgress = false;
        this.onAgentResponse(response);
      })
      .catch(error => {
        console.error('Agent error:', error);
        this.agentInProgress = false;
      });
  }

  async onAgentResponse(response: AgentResponse) {
    console.log(response);
    const content = response.content[response.content.length - 1]!.text;
    this.dialogFlow.push(new AssistantTextDialogue(content));
    this.saveToProject();

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
