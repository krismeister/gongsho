# The stream come as these types

```
type TextStreamPart<TOOLS extends ToolSet> = {
    type: 'text-delta';
    textDelta: string;
} | {
    type: 'reasoning';
    textDelta: string;
} | {
    type: 'source';
    source: Source;
} | ({
    type: 'tool-call';
} & ToolCallUnion<TOOLS>) | {
    type: 'tool-call-streaming-start';
    toolCallId: string;
    toolName: string;
} | {
    type: 'tool-call-delta';
    toolCallId: string;
    toolName: string;
    argsTextDelta: string;
} | ({
    type: 'tool-result';
} & ToolResultUnion<TOOLS>) | {
    type: 'step-start';
    messageId: string;
    request: LanguageModelRequestMetadata;
    warnings: CallWarning[];
} | {
    type: 'step-finish';
    messageId: string;
    logprobs?: LogProbs;
    request: LanguageModelRequestMetadata;
    warnings: CallWarning[] | undefined;
    response: LanguageModelResponseMetadata;
    usage: LanguageModelUsage;
    finishReason: FinishReason;
    providerMetadata: ProviderMetadata | undefined;
    /**
     * @deprecated Use `providerMetadata` instead.
     */
    experimental_providerMetadata?: ProviderMetadata;
    isContinued: boolean;
} | {
    type: 'finish';
    finishReason: FinishReason;
    usage: LanguageModelUsage;
    providerMetadata: ProviderMetadata | undefined;
    /**
     * @deprecated Use `providerMetadata` instead.
     */
    experimental_providerMetadata?: ProviderMetadata;
    /**
     * @deprecated will be moved into provider metadata
     */
    logprobs?: LogProbs;
    /**
     * @deprecated use response on step-finish instead
     */
    response: LanguageModelResponseMetadata;
} | {
    type: 'error';
    error: unknown;
};
```
