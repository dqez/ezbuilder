import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { streamText } from 'ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { ChatHistoryService } from './services/chat-history.service';
import { PromptBuilderService } from './prompts/prompt-builder.service';

@Injectable()
export class AiService {
  private readonly apiKey: string;
  private readonly model: string;

  constructor(
    private config: ConfigService,
    private chatHistory: ChatHistoryService,
    private promptBuilder: PromptBuilderService,
  ) {
    this.apiKey = this.config.get('GOOGLE_AI_API_KEY') || '';
    this.model = this.config.get('AI_DEFAULT_MODEL') || 'gemini-3-pro-preview';
  }

  async *streamChat(params: {
    userId: string;
    chatId?: string;
    pageId: string;
    message: string;
    canvasState?: any;
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
      // Yield chat ID to client
      yield JSON.stringify({ type: 'chat_id', chatId }) + '\n';
    }

    // Save user message
    await this.chatHistory.addMessage(chatId, 'user', params.message);

    // Build prompts using PromptBuilderService
    const systemPrompt = this.promptBuilder.buildSystemPrompt();
    const userContext = this.promptBuilder.buildUserContext({
      canvasState: params.canvasState,
      selectedNode: params.selectedNode,
    });

    // Combine context + user message
    const userPrompt = userContext
      ? `${userContext}\n\n## User Request\n${params.message}`
      : params.message;

    // Stream from Gemini
    const google = createGoogleGenerativeAI({
      apiKey: this.apiKey,
    });

    const result = streamText({
      model: google(this.model),
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }],
      temperature: 0.7,
    });

    let fullResponse = '';

    for await (const chunk of result.textStream) {
      fullResponse += chunk;
      yield JSON.stringify({ type: 'text', content: chunk }) + '\n';
    }

    // Save assistant message
    await this.chatHistory.addMessage(chatId, 'assistant', fullResponse);

    yield JSON.stringify({ type: 'done' }) + '\n';
  }
}
