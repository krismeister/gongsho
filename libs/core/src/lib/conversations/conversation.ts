import { AgentMessageRoles, AgentModels, ChangeList, ConversationDetails, defaultAgentModel, DialogData, DialogRoles, Usage } from '@gongsho/types';
import { BehaviorSubject, map, ReplaySubject } from 'rxjs';
import { AgentResponse } from '../agents/abstract-agent';
import { getAgent } from '../agents/agents';
import { AssistantAcknowledgedDialog } from '../dialog/agent/assistant-acknowledged.dialog';
import { AssistantChangelistDialog } from '../dialog/agent/assistant-changelist.dialog';
import { AssistantTextDialog } from '../dialog/agent/assistant-text.dialog';
import { BaseDialog } from '../dialog/base-dialog';
import { ChangelistAppliedDialog } from '../dialog/info/changelist-applied.dialog';
import { AddFilesDialog } from '../dialog/interstitial/add-files.dialog';
import { ChangelistDialog } from '../dialog/interstitial/changelist.dialog';
import { FilesChangedDialog } from '../dialog/interstitial/files-changed.dialog';
import { RepoMapDialog } from '../dialog/interstitial/repo-map.dialog';
import { WholeCodebaseDialog } from '../dialog/system/whole-codebase.dialog';
import { UserInputDialog } from '../dialog/user-input.dialog';
import { contentToChangelist } from '../utils/changelist';
import { loadConversation, saveConversationDetails } from '../utils/storage';
import { ConversationFiles } from './conversation-files';
export class Conversation {

  // TODO cleanup: we don't need to hold onto this dialogflow array.
  private dialogFlow: BaseDialog[] = [];

  private dialogStream$ = new ReplaySubject<BaseDialog>();
  private dialogDataStream$ = this.dialogStream$.pipe(map(dialog => dialog.getDialogData()));

  private agentBusy$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

  private files = new ConversationFiles();
  private dialogQueue: BaseDialog[] = [];
  private agentInProgress = false;

  constructor(
    public id: string,
    public startingInput?: string
  ) {
  }

  private saveToProject() {
    saveConversationDetails({
      id: this.id,
      files: this.files.getFiles(),
      dialogData: this.dialogFlow.map(item => item.getDialogData()),
    })
  }

  public getDialogDataStream() {
    return this.dialogDataStream$
  }

  public getConversationDetails(): ConversationDetails {
    return {
      id: this.id,
      files: this.files.getFiles(),
      dialogData: this.dialogFlow.map(item => item.getDialogData()),
    }
  }


  public load() {
    const savedConversation = loadConversation(this.id)
    this.dialogFlow = savedConversation.dialogData.map((item: DialogData) => {
      const dialogItem = BaseDialog.fromDialogData(item);
      this.dialogStream$.next(dialogItem);
      return dialogItem;
    });
    this.files.addFilesWithHashes(savedConversation.files);
  }

  public async addUserInput(userInput: string, agent: AgentModels) {
    if (this.dialogFlow.length === 0) {
      this.startConversation(userInput, agent);
      return
    }
    const changedFiles = await this.files.getChangedFiles();
    if (changedFiles.length > 0) {
      const filesChangedDialog = await FilesChangedDialog.create(changedFiles.map(file => file.relativePath));
      this.files.applyChanges(changedFiles);
      this.dialogQueue.push(filesChangedDialog);
    }
    // const lastDialog = this.dialogFlow.at(-1)!.role = ;
    this.dialogQueue.push(new UserInputDialog(userInput, {}, agent));
    this.sendNextQueueItemToAgent();
  }

  public async addInfoDialog(type: 'changelist-applied') {
    console.log('adding info dialog', type);
    const infoDialog = new ChangelistAppliedDialog();

    this.dialogFlow.push(infoDialog);
    this.dialogStream$.next(infoDialog);
    this.saveToProject();
  }

  public async requestChangelist() {
    this.dialogQueue.push(ChangelistDialog.create(this.lastAgent));
    this.sendNextQueueItemToAgent();
  }

  public async getChangelistResponse(id: string): Promise<ChangeList> {
    const dialog = this.dialogFlow.find(dialog => dialog.id === id);
    if (dialog?.dialogRole !== DialogRoles.CHANGELIST) {
      throw new Error('Invalid changelist id');
    }
    return contentToChangelist(dialog.getDialogData().content);
  }

  public async addFiles(files: string[]) {
    await this.files.addFiles(files);
  }

  private async startConversation(userInput: string, agent: AgentModels) {
    const systemDialog = new WholeCodebaseDialog();
    const repoMapDialog = RepoMapDialog.create(this.lastAgent);

    this.dialogFlow.push(systemDialog);
    this.dialogStream$.next(systemDialog);

    this.dialogQueue.push(repoMapDialog);
    this.dialogQueue.push(new UserInputDialog(userInput, {}, agent));

    this.sendNextQueueItemToAgent();
  }

  sendNextQueueItemToAgent() {
    if (
      this.dialogFlow.length < 1 ||
      this.dialogQueue.length < 1 ||
      this.agentInProgress
    ) {
      return;
    }

    this.agentInProgress = true;
    this.agentBusy$.next(true);

    // moving item from queue to flow
    const dialog = this.dialogQueue.shift()!;

    this.dialogFlow.push(dialog);
    this.dialogStream$.next(dialog);

    this.saveToProject();

    const messages = this.dialogFlow
      .filter(item => item.role !== AgentMessageRoles.NONE)
      .map(item => ({
        role: item.role as 'user' | 'assistant',
        content: {
          type: 'text',
          text: item.content,
        },
      }));

    const system = messages.shift()!;


    getAgent(this.lastAgent)
      .sendMessages(system.content.text, messages, this.lastAgent)
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

    if (response.steps.length === 0) {
      throw new Error('Agent response is empty, but should not happen.');
    }

    if (response.steps.length > 1) {
      console.warn('Agent response has more than one step, but should not happen.');
    }

    const content = response.steps[0].text;

    let usage: Usage = {
      input_tokens: 0,
      output_tokens: 0,
    };
    if (response.usage) {
      usage = {
        input_tokens: response.usage.promptTokens,
        output_tokens: response.usage.completionTokens,
      };
    }

    let dialog: BaseDialog;
    if (content.startsWith('CHANGELIST')) {
      dialog = AssistantChangelistDialog.create(content, response.response.modelId as AgentModels, usage);
    } else if (content == 'OK') {
      dialog = AssistantAcknowledgedDialog.create(content, response.response.modelId as AgentModels, usage);
    } else {
      dialog = AssistantTextDialog.create(content, response.response.modelId as AgentModels, usage);
    }

    this.dialogFlow.push(dialog);
    this.dialogStream$.next(dialog);

    this.saveToProject();

    if (content.includes('EXAMINE_FILES')) {
      const examineFilesRegex = /EXAMINE_FILES:(.*?)(?:\n|$)/;
      const match = content.match(examineFilesRegex);
      const files = match ? match[1].trim().split(',') : [];
      await this.files.addFiles(files, true);
      const addFilesDialog = await AddFilesDialog.create(files, this.lastAgent);
      this.dialogQueue.unshift(addFilesDialog);
    }

    if (this.dialogQueue.length > 0) {
      this.sendNextQueueItemToAgent();
    }
  }

  protected get lastAgent(): AgentModels {
    // First check dialogQueue from newest to oldest
    for (let i = this.dialogQueue.length - 1; i >= 0; i--) {
      const agent = this.dialogQueue[i].getDialogData().agent;
      if (agent) return agent;
    }

    // Then check dialogFlow from newest to oldest
    for (let i = this.dialogFlow.length - 1; i >= 0; i--) {
      const agent = this.dialogFlow[i].getDialogData().agent;
      if (agent) return agent;
    }

    return defaultAgentModel;
  }

}
