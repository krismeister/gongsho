import { DialogueData } from '@gongsho/types';
import { AbstractAgent, AgentResponse } from '../agents/abstract-agent';
import { ClaudeAgent } from '../agents/claude-agent';
import { gongshoConfig } from '../config/config';
import { AssistantTextDialogue } from '../dialogue/agent/assistant-text.dialogue';
import { BaseDialogue } from '../dialogue/base-dialogue';
import { AddFilesDialogue } from '../dialogue/interstitial/add-files.dialogue';
import { RepoMapDialogue } from '../dialogue/interstitial/repo-map.dialogue';
import { WholeCodebaseDialogue } from '../dialogue/system/whole-codebase.dialogue';
import { UserInputDialogue } from '../dialogue/user-input.dialogue';
import { AgentModelConfigs, AgentModels } from '../models/model-configs';
import { RepoMap } from '../repo-map/repo-map';
import { loadConversation, saveConversation } from '../utils/storage';

export class Conversation {
  private dialogFlow: BaseDialogue[] = [];
  private repoMap?: RepoMap;
  private includedFiles: string[] = [];
  private dialogueQueue: BaseDialogue[] = [];
  private agentInProgress = false;
  private config = gongshoConfig;
  private agent: AbstractAgent;

  constructor(
    public id: string
  ) {
    this.agent = new ClaudeAgent(AgentModelConfigs[AgentModels.CLAUDE_3_SONNET]);
  }

  private saveToProject() {
    saveConversation({
      id: this.id,
      dialogueData: this.dialogFlow.map(item => item.getDialogueData()),
      includedFiles: this.includedFiles,
    })
  }

  public getDialogueData(): DialogueData[] {
    return this.dialogFlow.map(item => item.getDialogueData());
  }

  public initFromProject(id: string) {
    this.id = id;
    const savedConversation = loadConversation(this.id)
    this.dialogFlow = savedConversation.dialogueData.map((item: DialogueData) =>
      BaseDialogue.fromDialogueData(item)
    );
    this.includedFiles = savedConversation.includedFiles;
  }

  public async initConversation() {
    this.repoMap = new RepoMap(this.config.PROJECT_ROOT);
    await this.repoMap.buildFileMap();
  }

  public async addUserInput(userInput: string) {
    this.dialogueQueue.push(new UserInputDialogue(userInput));
    this.sendNextQueueItemToAgent();
  }

  public async startConversation(userInput: string) {
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

    if (response.content.length === 0) {
      throw new Error('Agent response is empty, but should not happen.');
    }

    const content = response.content[response.content.length - 1].text;
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
