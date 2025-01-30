import { getConfig } from '@/config/config';
import Anthropic from '@anthropic-ai/sdk';
import { astChangePrompt } from './prompts';
import type TextBlock from '@anthropic-ai/sdk/resources';

export let anthropic: Anthropic;

export const askClaude = async (ast: string, userPrompt: string) => {
  const prompt = astChangePrompt(ast, userPrompt);

  const config = getConfig();

  if (!anthropic) {
    anthropic = new Anthropic({
      apiKey: config.claude.apiKey,
    });
  }

  const msg = await anthropic.messages.create({
    model: config.claude.model,
    max_tokens: config.claude.maxTokens,
    temperature: 1,
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: prompt,
          },
        ],
      },
    ],
  });

  console.log(msg);
  return (msg.content.pop() as TextBlock).text;
};
