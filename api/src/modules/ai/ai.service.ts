import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { streamText } from 'ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { ChatHistoryService } from './services/chat-history.service';
import {
  PromptBuilderService,
  CanvasState,
} from './prompts/prompt-builder.service';

// Models attempted in order when the primary is unavailable (503/overload)
const FALLBACK_MODELS = ['gemini-2.5-pro', 'gemini-2.5-flash'];

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);
  private readonly apiKey: string;
  private readonly primaryModel: string;

  constructor(
    private config: ConfigService,
    private chatHistory: ChatHistoryService,
    private promptBuilder: PromptBuilderService,
  ) {
    this.apiKey = this.config.get('GOOGLE_AI_API_KEY') || '';
    this.primaryModel = this.config.get('AI_DEFAULT_MODEL') || 'gemini-3-flash';
  }

  async *streamChat(params: {
    userId: string;
    chatId?: string;
    pageId: string;
    message: string;
    canvasState?: CanvasState;
    selectedNode?: string;
  }): AsyncGenerator<string> {
    // Create or get chat
    let chatId = params.chatId;
    if (!chatId) {
      const chat = await this.chatHistory.createChat(
        params.userId,
        params.pageId,
      );
      chatId = chat.id;
      yield JSON.stringify({ type: 'chat_id', chatId }) + '\n';
    }

    await this.chatHistory.addMessage(chatId, 'user', params.message);

    const systemPrompt = this.promptBuilder.buildSystemPrompt();
    const userContext = this.promptBuilder.buildUserContext({
      canvasState: params.canvasState,
      selectedNode: params.selectedNode,
    });

    const userPrompt = userContext
      ? `${userContext}\n\n## User Request\n${params.message}`
      : params.message;

    const google = createGoogleGenerativeAI({ apiKey: this.apiKey });

    // Try primary model, then fallbacks on 503 overload
    const modelsToTry = [this.primaryModel, ...FALLBACK_MODELS];
    let lastError: unknown;

    for (const modelId of modelsToTry) {
      try {
        this.logger.log(`Attempting AI stream with model: ${modelId}`);

        const result = streamText({
          model: google(modelId),
          system: systemPrompt,
          messages: [{ role: 'user', content: userPrompt }],
          temperature: 0.7,
        });

        let fullResponse = '';

        for await (const chunk of result.textStream) {
          fullResponse += chunk;
          yield JSON.stringify({ type: 'text', content: chunk }) + '\n';
        }

        await this.chatHistory.addMessage(chatId, 'assistant', fullResponse);
        yield JSON.stringify({ type: 'done' }) + '\n';
        return; // Success — stop iterating fallbacks
      } catch (err: unknown) {
        const isOverload = this.isOverloadError(err);

        if (isOverload) {
          this.logger.warn(
            `Model ${modelId} is overloaded (503). Trying next fallback...`,
          );
          lastError = err;
          continue; // Try next model
        }

        // Non-503 error — re-throw immediately
        throw err;
      }
    }

    // All models exhausted
    this.logger.error('All AI models failed. Last error:', lastError);
    yield JSON.stringify({
      type: 'error',
      message:
        'AI service is temporarily unavailable. Please try again in a moment.',
    }) + '\n';
  }

  private isOverloadError(err: unknown): boolean {
    if (!err || typeof err !== 'object') return false;
    const e = err as Record<string, unknown>;
    // Vercel AI SDK wraps 503 as AI_RetryError or AI_APICallError
    if (
      e['statusCode'] === 503 ||
      (typeof e['responseBody'] === 'string' &&
        e['responseBody'].includes('UNAVAILABLE'))
    ) {
      return true;
    }
    // Nested errors array (RetryError)
    if (Array.isArray(e['errors'])) {
      return (e['errors'] as unknown[]).some((sub) =>
        this.isOverloadError(sub),
      );
    }
    return false;
  }
}
