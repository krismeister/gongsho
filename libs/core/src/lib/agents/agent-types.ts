import { CallWarning, FinishReason, LanguageModelRequestMetadata, LanguageModelResponseMetadata, LanguageModelUsage, LogProbs, ProviderMetadata, StreamTextOnChunkCallback, TextStreamPart, ToolCallUnion, ToolResultUnion, ToolSet } from 'ai';
export type AgentMessage = {
  role: 'user' | 'assistant';
  content: {
    type: string; // 'text' | 'tool';
    text: string;
  }
};

export type AgentFragment = {
  id: string;
  text: string;
}

export type AgentResponse = {
  id: string;
  requestId?: string;
  finishReason: string;
  text: string;
  usage: {
    promptTokens: number;
    completionTokens: number;
    cacheCreationInputTokens?: number;
    cacheReadInputTokens?: number;
  };
  model: string;
  // steps: AgentResponse['steps'];
};

export type AgentResponseFragment = StreamTextOnChunkCallback<ToolSet>;

// Define type guards for 'finish' and 'text-delta' types
export const isTextDelta = <TOOLS extends ToolSet>(part: TextStreamPart<TOOLS>): part is Extract<TextStreamPart<TOOLS>, { type: 'text-delta' }> => {
  return part.type === 'text-delta';
};

export const isReasoning = <TOOLS extends ToolSet>(part: TextStreamPart<TOOLS>): part is Extract<TextStreamPart<TOOLS>, { type: 'reasoning' }> => {
  return part.type === 'reasoning';
};

export const isSource = <TOOLS extends ToolSet>(part: TextStreamPart<TOOLS>): part is Extract<TextStreamPart<TOOLS>, { type: 'source' }> => {
  return part.type === 'source';
};

export const isToolCall = <TOOLS extends ToolSet>(part: TextStreamPart<TOOLS>): part is Extract<TextStreamPart<TOOLS>, { type: 'tool-call' }> => {
  return part.type === 'tool-call';
};

export const isToolCallStreamingStart = <TOOLS extends ToolSet>(part: TextStreamPart<TOOLS>): part is Extract<TextStreamPart<TOOLS>, { type: 'tool-call-streaming-start' }> => {
  return part.type === 'tool-call-streaming-start';
};

export const isToolCallDelta = <TOOLS extends ToolSet>(part: TextStreamPart<TOOLS>): part is Extract<TextStreamPart<TOOLS>, { type: 'tool-call-delta' }> => {
  return part.type === 'tool-call-delta';
};

export const isToolResult = <TOOLS extends ToolSet>(part: TextStreamPart<TOOLS>): part is Extract<TextStreamPart<TOOLS>, { type: 'tool-result' }> => {
  return part.type === 'tool-result';
};

export const isStepStart = <TOOLS extends ToolSet>(part: TextStreamPart<TOOLS>): part is Extract<TextStreamPart<TOOLS>, { type: 'step-start' }> => {
  return part.type === 'step-start';
};

export const isStepFinish = <TOOLS extends ToolSet>(part: TextStreamPart<TOOLS>): part is Extract<TextStreamPart<TOOLS>, { type: 'step-finish' }> => {
  return part.type === 'step-finish';
};

export const isError = <TOOLS extends ToolSet>(part: TextStreamPart<TOOLS>): part is Extract<TextStreamPart<TOOLS>, { type: 'error' }> => {
  return part.type === 'error';
};

export const isFinish = <TOOLS extends ToolSet>(part: TextStreamPart<TOOLS>): part is Extract<TextStreamPart<TOOLS>, { type: 'finish' }> => {
  return part.type === 'finish';
};

type SpecificPart<TOOLS extends ToolSet, Type extends string, Data> = Extract<TextStreamPart<TOOLS>, { type: Type }> & Data;

export const isSpecificPart = <T extends string, TOOLS extends ToolSet, Data>(
  part: TextStreamPart<TOOLS>,
  type: T
): part is SpecificPart<TOOLS, T, Data> => {
  return part.type === type;
};

export type TextDeltaPart<TOOLS extends ToolSet> = SpecificPart<TOOLS, 'text-delta', { textDelta: string }>;
export type ReasoningPart<TOOLS extends ToolSet> = SpecificPart<TOOLS, 'reasoning', { textDelta: string }>;
export type SourcePart<TOOLS extends ToolSet> = SpecificPart<TOOLS, 'source', { source: unknown }>;

export type ToolCallPart<TOOLS extends ToolSet> = SpecificPart<TOOLS, 'tool-call', ToolCallUnion<TOOLS>>;
export type ToolCallStreamingStartPart<TOOLS extends ToolSet> = SpecificPart<TOOLS, 'tool-call-streaming-start', {
  toolCallId: string;
  toolName: string;
}>;
export type ToolCallDeltaPart<TOOLS extends ToolSet> = SpecificPart<TOOLS, 'tool-call-delta', {
  toolCallId: string;
  toolName: string;
  argsTextDelta: string;
}>;
export type ToolResultPart<TOOLS extends ToolSet> = SpecificPart<TOOLS, 'tool-result', ToolResultUnion<TOOLS>>;
export type StepStartPart<TOOLS extends ToolSet> = SpecificPart<TOOLS, 'step-start', {
  messageId: string;
  request: LanguageModelRequestMetadata;
  warnings: CallWarning[];
}>;
export type StepFinishPart<TOOLS extends ToolSet> = SpecificPart<TOOLS, 'step-finish', {
  messageId: string;
  logprobs?: LogProbs;
  request: LanguageModelRequestMetadata;
  warnings: CallWarning[] | undefined;
  response: LanguageModelResponseMetadata;
  usage: LanguageModelUsage;
  finishReason: FinishReason;
  providerMetadata: ProviderMetadata | undefined;
  experimental_providerMetadata?: ProviderMetadata;
  isContinued: boolean;
}>;
export type FinishPart<TOOLS extends ToolSet> = SpecificPart<TOOLS, 'finish', {
  finishReason: FinishReason;
  usage: LanguageModelUsage;
  providerMetadata: ProviderMetadata | undefined;
  experimental_providerMetadata?: ProviderMetadata;
  logprobs?: LogProbs;
  response: LanguageModelResponseMetadata;
}>;
export type ErrorPart<TOOLS extends ToolSet> = SpecificPart<TOOLS, 'error', {
  error: unknown;
}>;

// {
//   finishReason: 'stop',
//   logprobs: undefined,
//   usage: { promptTokens: 2357, completionTokens: 4, totalTokens: 2361 },
//   text: 'OK',
//   reasoning: undefined,
//   sources: [],
//   toolCalls: [],
//   toolResults: [],
//   request: {
//     body: '{"model":"claude-3-5-sonnet-20241022","max_tokens":8192,"temperature":0,"system":[{"type":"text","text":"\\nAct as an expert software developer.\\nAlways use best practices when coding.\\nRespect and use existing conventions, libraries, etc that are already present in the code base.\\n\\nTake requests for changes to the supplied code.\\nIf the request is ambiguous, ask questions.\\n\\nOnce you understand the request you MUST:\\n\\n1. Decide which likely files the user wants you to edit, and request their contents by saying \\"I will examine this files.\\" along with an *EXAMINE_FILES* request.\\n\\nFor example:\\nI will examine these files:\\nEXAMINE_FILES:src/main.ts,src/pages/index.tsx\\n\\nNever use with the token *EXAMINE_FILES* unless you need to examine new files not already provided in the chat.\\n\\n2. If you need better understanding of the codebase to fulfill the user\'s request, you can ask to *EXAMINE_FILES* to get more context.\\nWhenever you identify that more files must be examined, end your reply and wait for the user to add thier contents.\\n\\n3. Decide if you need to propose *SEARCH/REPLACE* edits to any files that have\'t been added to the chat. You can create new files without asking!\\n\\n4. Think step-by-step and explain the needed changes in a few short sentences.\\n\\n5. Describe each change with a *SEARCH/REPLACE block* per the examples below.\\n\\nAll changes to files must use this *SEARCH/REPLACE block* format.\\nONLY EVER RETURN CODE IN A *SEARCH/REPLACE BLOCK*!\\n\\n6. *Concisely* suggest any shell commands the user might want to run in ```bash blocks.\\n\\nJust suggest shell commands this way, not example code.\\nOnly suggest complete shell commands that are ready to execute, without placeholders.\\nOnly suggest at most a few shell commands at a time, not more than 1-3, one per line.\\nDo not suggest multi-line shell commands.\\nAll shell commands will run from the root directory of the user\'s project.\\n\\nUse the appropriate shell based on the user\'s info:\\n  - Platform: linux-5.15.0-131-generic-x64\\n  - Shell: SHELL=/bin/bash\\n  - Language: en_US.UTF-8\\n  - Current date: 2025-02-11\\n\\nExamples of when to suggest shell commands:\\n\\n- If you changed a CLI program, suggest the command to run it to see the new behavior.\\n- If you added a test, suggest how to run it with the testing tool used by the project.\\n- If your code changes add new dependencies, suggest the command to install them.\\n- Etc.\\n\\n\\n# Example conversations:\\n\\n## USER: Here are the files in my project.\\n\\nsrc/main.ts\\nsrc/math/factorial.ts\\n\\n## ASSISTANT: Ok, what is your request?\\n\\n## USER: Change calculateFactorial() to use the built-in BigInt\\n\\n## ASSISTANT: I need to examine some files in order to recommend changes.\\n\\nEXAMINE_FILES:src/math/factorial.ts\\n\\n## USER: Here are the file contents you requested.\\n\\nsrc/math/factorial.ts\\n```typescript\\nexport class MathUtils {\\n\\n  static LARGE_BASE = 32\\n\\n  public calculateFactorial(n: number): number {\\n    return this.recursiveFactorial(n);\\n  }\\n\\n  private recursiveFactorial(n: number): number {\\n    if (n === 0) {\\n      return 1;\\n    }\\n    return n * this.recursiveFactorial(n - 1);\\n  }\\n}\\n```\\n\\n## ASSISTANT: To make this change we need to modify `src/math/factorial.ts` to:\\n\\n1. Remove the recursive factorial implementation\\n2. Use BigInt for larger number support\\n3. Update calculateFactorial() to use BigInt calculations\\n\\nHere are the *SEARCH/REPLACE* blocks:\\n\\nsrc/math/factorial.ts\\n```typescript\\n<<<<<<< SEARCH\\nexport class MathUtils {\\n=======\\nexport class MathUtils {\\n  // Using BigInt for larger number support\\n>>>>>>> REPLACE\\n```\\n\\nsrc/math/factorial.ts\\n```typescript\\n<<<<<<< SEARCH\\n  private recursiveFactorial(n: number): number {\\n    if (n === 0) {\\n      return 1;\\n    }\\n    return n * this.recursiveFactorial(n - 1);\\n  }\\n\\n=======\\n>>>>>>> REPLACE\\n```\\n\\nsrc/math/factorial.ts\\n```typescript\\n<<<<<<< SEARCH\\n  public calculateFactorial(n: number): number {\\n    return this.recursiveFactorial(n);\\n=======\\n  public calculateFactorial(n: number): bigint {\\n    return BigInt(n) === 0n ? 1n : BigInt(n) * this.calculateFactorial(n - 1);\\n>>>>>>> REPLACE\\n```\\n\\n## USER: Next, please refactor hello() into its own file.\\n\\n## ASSISTANT: I need to examine some files in order to recommend changes.\\n\\nEXAMINE_FILES:src/main.ts\\n\\n## USER: Here are the file contents you requested.\\n\\nsrc/main.ts\\n```typescript\\nfunction hello(): void {\\n    // Print a greeting\\n    console.log(\\"hello\\");\\n}\\n\\nmain() {\\n    hello();\\n}\\n```\\n\\n## ASSISTANT: To make this change we need to modify `main.ts` and make a new file `hello.ts`:\\n\\n1. Make a new hello.ts file with hello() in it.\\n2. Remove hello() from main.ts and replace it with an import.\\n\\nHere are the *SEARCH/REPLACE* blocks:\\n\\nhello.ts\\n```typescript\\n<<<<<<< SEARCH\\n=======\\nexport function hello(): void {\\n    // Print a greeting\\n    console.log(\\"hello\\");\\n}\\n>>>>>>> REPLACE\\n```\\n\\nmain.ts\\n```typescript\\n<<<<<<< SEARCH\\nfunction hello(): void {\\n    // Print a greeting\\n    console.log(\\"hello\\");\\n}\\n=======\\nimport { hello } from \'./hello\';\\n>>>>>>> REPLACE\\n```\\n\\n# *SEARCH/REPLACE block* Rules:\\n\\nEvery *SEARCH/REPLACE block* must use this format:\\n1. The *FULL* file path alone on a line, verbatim. No bold asterisks, no quotes around it, no escaping of characters, etc.\\n2. Base any *SEARCH/REPLACE* on the original file contents you were given.\\n3. The opening fence and code language, eg: ```typescript\\n4. The start of search block: <<<<<<< SEARCH\\n5. A contiguous chunk of lines to search for in the existing source code\\n6. The dividing line: =======\\n7. The lines to replace into the source code\\n8. The end of the replace block: >>>>>>> REPLACE\\n9. The closing fence: ```\\n\\nUse the *FULL* file path, as shown to you by the user.\\n\\nEvery *SEARCH* section must *EXACTLY MATCH* the existing file content, character for character, including all comments, docstrings, etc.\\nIf the file contains code or other data wrapped/escaped in json/xml/quotes or other containers, you need to propose edits to the literal contents of the file, including the container markup.\\n\\n*SEARCH/REPLACE* blocks will *only* replace the first match occurrence.\\nIncluding multiple unique *SEARCH/REPLACE* blocks if needed.\\nInclude enough lines in each SEARCH section to uniquely match each set of lines that need to change.\\n\\nKeep *SEARCH/REPLACE* blocks concise.\\nBreak large *SEARCH/REPLACE* blocks into a series of smaller blocks that each change a small portion of the file.\\nInclude just the changing lines, and a few surrounding lines if needed for uniqueness.\\nDo not include long runs of unchanging lines in *SEARCH/REPLACE* blocks.\\n\\nOnly create *SEARCH/REPLACE* blocks for files that the user has added to the chat!\\n\\nIf you want to rename a file submit two SEARCH/REPLACE blocks:\\n\\n1. The first *SEARCH/REPLACE* block with the entire content removed.\\n2. The second *SEARCH/REPLACE* block the new file contents.\\n\\nFor instance to rename `src/info.ts` to `src/greetings.ts` use these SEARCH/REPLACE blocks:\\n\\nsrc/info.ts\\n```typescript\\n<<<<<<< SEARCH\\nimport { formattedTime } from \'./utils/time\';\\n\\nexport function hello(): void {\\n   // Print a greeting\\n   console.log(`hello it is ${formattedTime()} `);\\n}\\n=======\\n>>>>>>> REPLACE\\n```\\n\\nsrc/utils/greetings.ts\\n```typescript\\n<<<<<<< SEARCH\\n=======\\nimport { formattedTime } from \'./time\';\\n\\nexport function hello(): void {\\n   // Print a greeting\\n   console.log(`hello it is ${formattedTime()} `);\\n}\\n>>>>>>> REPLACE\\n```\\n\\nTo move code within a file, use 2 *SEARCH/REPLACE* blocks: 1 to delete it from its current location, 1 to insert it in the new location.\\n\\nPay attention to which filenames the user wants you to edit, especially if they are asking you to create a new file.\\n\\nIf you want to put code in a new file, use a *SEARCH/REPLACE block* with:\\n- A new file path, including dir name if needed\\n- An empty `SEARCH` section\\n- The new file\'s contents in the `REPLACE` section\\n\\nONLY EVER RETURN CODE IN A *SEARCH/REPLACE BLOCK*!\\n\\nExamples of when to suggest shell commands:\\n\\n- If you changed a CLI program, suggest the command to run it to see the new behavior.\\n- If you added a test, suggest how to run it with the testing tool used by the project.\\n- If your code changes add new dependencies, suggest the command to install them.\\n- Etc."}],"messages":[{"role":"user","content":[{"type":"text","text":"Here are the files in my project.\\nDo not propose changes to these files, treat them as *read-only*.\\nIf you need to edit or understand any of these files use *EXAMINE_FILES*.\\n\\nIf you understand this message, respond with \\"OK\\"\\n\\n.gongsho.zip\\nsimple.ts\\nsub-folder/sub-sub-folder/my-sub-folder-test.ts\\nutils/math-utils.ts\\nutils/random.ts"}]}],"stream":true}'
//   },
//   response: {
//     id: 'msg_01KfFhSVH65ayRp5k89Pwb45',
//     timestamp: 2025-02-24T22:25:32.632Z,
//     modelId: 'claude-3-5-sonnet-20241022',
//     headers: {
//       'anthropic-organization-id': '997c7200-d1d1-48e0-9156-c3267149fc5a',
//       'anthropic-ratelimit-input-tokens-limit': '80000',
//       'anthropic-ratelimit-input-tokens-remaining': '78000',
//       'anthropic-ratelimit-input-tokens-reset': '2025-02-24T22:25:32Z',
//       'anthropic-ratelimit-output-tokens-limit': '16000',
//       'anthropic-ratelimit-output-tokens-remaining': '12000',
//       'anthropic-ratelimit-output-tokens-reset': '2025-02-24T22:25:47Z',
//       'anthropic-ratelimit-requests-limit': '1000',
//       'anthropic-ratelimit-requests-remaining': '999',
//       'anthropic-ratelimit-requests-reset': '2025-02-24T22:25:30Z',
//       'anthropic-ratelimit-tokens-limit': '96000',
//       'anthropic-ratelimit-tokens-remaining': '90000',
//       'anthropic-ratelimit-tokens-reset': '2025-02-24T22:25:32Z',
//       'cache-control': 'no-cache',
//       'cf-cache-status': 'DYNAMIC',
//       'cf-ray': '9172df34dae675c4-SEA',
//       connection: 'keep-alive',
//       'content-type': 'text/event-stream; charset=utf-8',
//       date: 'Mon, 24 Feb 2025 22:25:32 GMT',
//       'request-id': 'req_01UBbuBZTAEGvsiW3otqwmYr',
//       server: 'cloudflare',
//       'transfer-encoding': 'chunked',
//       via: '1.1 google',
//       'x-robots-tag': 'none'
//     },
//     messages: [ [Object] ]
//   },
//   warnings: [],
//   providerMetadata: {
//     anthropic: { cacheCreationInputTokens: 0, cacheReadInputTokens: 0 }
//   },
//   experimental_providerMetadata: {
//     anthropic: { cacheCreationInputTokens: 0, cacheReadInputTokens: 0 }
//   },
//   steps: [
//     {
//       stepType: 'initial',
//       text: 'OK',
//       reasoning: undefined,
//       sources: [],
//       toolCalls: [],
//       toolResults: [],
//       finishReason: 'stop',
//       usage: [Object],
//       warnings: [],
//       logprobs: undefined,
//       request: [Object],
//       response: [Object],
//       providerMetadata: [Object],
//       experimental_providerMetadata: [Object],
//       isContinued: false
//     }
//   ]
// }
