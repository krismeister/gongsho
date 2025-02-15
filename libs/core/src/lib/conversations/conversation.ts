import { AgentMessageRoles, ConversationDetails, DialogRoles, DialogueData } from '@gongsho/types';
import { BehaviorSubject, map, ReplaySubject } from 'rxjs';
import { AbstractAgent, AgentResponse } from '../agents/abstract-agent';
import { ClaudeAgent } from '../agents/claude-agent';
import { AssistantChangelogDialogue } from '../dialogue/agent/assistant-changelog.dialogue';
import { AssistantTextDialogue } from '../dialogue/agent/assistant-text.dialogue';
import { BaseDialogue } from '../dialogue/base-dialogue';
import { ChangelogAppliedDialogue } from '../dialogue/info/changlog-applied';
import { AddFilesDialogue } from '../dialogue/interstitial/add-files.dialogue';
import { ChangelogDialogue } from '../dialogue/interstitial/changelog.dialogue';
import { RepoMapDialogue } from '../dialogue/interstitial/repo-map.dialogue';
import { WholeCodebaseDialogue } from '../dialogue/system/whole-codebase.dialogue';
import { UserInputDialogue } from '../dialogue/user-input.dialogue';
import { AgentModelConfigs, AgentModels } from '../models/model-configs';
import { RepoMap } from '../repo-map/repo-map';
import { conversationExists, loadConversation, saveConversationDetails } from '../utils/storage';

export class Conversation {

  private dialogFlow: BaseDialogue[] = [];

  private dialogueStream$ = new ReplaySubject<BaseDialogue>();
  private dialogueDataStream$ = this.dialogueStream$.pipe(map(dialogue => dialogue.getDialogueData()));

  private agentBusy$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

  private files: string[] = [];
  private dialogueQueue: BaseDialogue[] = [];
  private agentInProgress = false;
  private agent: AbstractAgent;

  constructor(
    public id: string,
    public startingInput?: string
  ) {
    this.agent = new ClaudeAgent(AgentModelConfigs[AgentModels.CLAUDE_3_SONNET]);
    if (!conversationExists(this.id)) {
      this.saveToProject()
    }
  }

  private saveToProject() {
    saveConversationDetails({
      id: this.id,
      files: this.files,
      dialogueData: this.dialogFlow.map(item => item.getDialogueData()),
    })
  }

  public getDialogueDataStream() {
    return this.dialogueDataStream$
  }

  public getConversationDetails(): ConversationDetails {
    return {
      id: this.id,
      files: this.files,
      dialogueData: this.dialogFlow.map(item => item.getDialogueData()),
    }
  }


  public load() {
    const savedConversation = loadConversation(this.id)
    this.dialogFlow = savedConversation.dialogueData.map((item: DialogueData) => {
      const dialogItem = BaseDialogue.fromDialogueData(item);
      this.dialogueStream$.next(dialogItem);
      return dialogItem;
    });
    this.files = savedConversation.files;
  }

  public async addUserInput(userInput: string) {
    if (this.dialogFlow.length === 0) {
      this.startConversation(userInput);
      return
    }
    this.dialogueQueue.push(new UserInputDialogue(userInput));
    this.sendNextQueueItemToAgent();
  }

  public async addInfoDialogue(type: 'changelog-applied') {
    console.log('adding info dialogue', type);
    const infoDialogue = new ChangelogAppliedDialogue();

    this.dialogFlow.push(infoDialogue);
    this.dialogueStream$.next(infoDialogue);
    this.saveToProject();
  }

  public async requestChangeLog() {
    this.dialogueQueue.push(new ChangelogDialogue());
    this.sendNextQueueItemToAgent();
  }

  public async getChangelogResponse(id: string): Promise<DialogueData> {
    debugger;
    const dialogue = this.dialogFlow.find(dialogue => dialogue.id === id);
    if (dialogue?.dialogueRole !== DialogRoles.CHANGELOG) {
      throw new Error('Invalid changelog id');
    }
    return dialogue.getDialogueData();
  }

  private async startConversation(userInput: string) {
    const systemDialogue = new WholeCodebaseDialogue();
    const repoMapDialogue = new RepoMapDialogue('', {
      repoMap: RepoMap.getRepoMapAstText(),
    });

    this.dialogFlow.push(systemDialogue);
    this.dialogueStream$.next(systemDialogue);

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
    this.agentBusy$.next(true);

    // moving item from queue to flow
    const dialogue = this.dialogueQueue.shift()!;

    this.dialogFlow.push(dialogue);
    this.dialogueStream$.next(dialogue);

    this.saveToProject();

    const messages = this.dialogFlow
      .filter(item => item.role !== AgentMessageRoles.NONE)
      .map(item => ({
        role: item.role as 'user' | 'assistant',
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
        this.agentBusy$.next(false);
        this.onAgentResponse(response);
      })
      .catch(error => {
        console.error('Agent error:', error);
        this.agentInProgress = false;
        this.agentBusy$.next(false);
      });
  }

  async onAgentResponse(response: AgentResponse) {
    if (response.content.length === 0) {
      throw new Error('Agent response is empty, but should not happen.');
    }

    const content = response.content[response.content.length - 1].text;

    let dialogue: BaseDialogue;
    if (content.startsWith('CHANGELOG')) {
      dialogue = new AssistantChangelogDialogue(content);
    } else {
      dialogue = new AssistantTextDialogue(content);
    }

    this.dialogFlow.push(dialogue);
    this.dialogueStream$.next(dialogue);

    this.saveToProject();

    if (content.includes('EXAMINE_FILES')) {
      const examineFilesRegex = /EXAMINE_FILES:(.*?)(?:\n|$)/;
      const match = content.match(examineFilesRegex);
      const files = match ? match[1].trim().split(',') : [];

      const repoFiles = await RepoMap.loadContents(files);

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
