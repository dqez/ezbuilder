import {
  Controller,
  Post,
  Body,
  Res,
  UseGuards,
  Req,
  Get,
  Query,
  Delete,
  Param,
} from '@nestjs/common';
import type { Response } from 'express';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { AiService } from './ai.service';
import { ChatHistoryService } from './services/chat-history.service';
import { ChatMessageDto } from './dto/chat-message.dto';

@Controller('ai')
@UseGuards(JwtAuthGuard)
export class AiController {
  constructor(
    private aiService: AiService,
    private chatHistory: ChatHistoryService,
  ) {}

  @Post('chat')
  async chat(
    @Body() dto: ChatMessageDto,
    @Req() req: any,
    @Res() res: Response,
  ) {
    const userId = req.user.userId;

    // Set SSE headers
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    try {
      for await (const chunk of this.aiService.streamChat({
        userId,
        chatId: dto.chatId,
        pageId: dto.pageId,
        message: dto.message,
        canvasState: dto.canvasState,
      })) {
        res.write(`data: ${chunk}\n\n`);
      }
    } catch (error) {
      console.error('Streaming error:', error);
      res.write(
        `data: ${JSON.stringify({ type: 'error', error: error.message })}\n\n`,
      );
    } finally {
      res.end();
    }
  }

  @Get('chats')
  async getChats(@Query('pageId') pageId: string) {
    return this.chatHistory.getChatsByPage(pageId);
  }

  @Get('chats/:chatId')
  async getChat(@Param('chatId') chatId: string) {
    return this.chatHistory.getChatWithMessages(chatId);
  }

  @Delete('chats/:chatId')
  async deleteChat(@Param('chatId') chatId: string) {
    return this.chatHistory.deleteChat(chatId);
  }
}
