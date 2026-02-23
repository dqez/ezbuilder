import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma/prisma.service';
import { Prisma } from 'generated/prisma/client';

@Injectable()
export class ChatHistoryService {
  constructor(private prisma: PrismaService) {}

  async createChat(userId: string, pageId: string) {
    return this.prisma.aiChat.create({
      data: {
        userId,
        pageId,
      },
    });
  }

  async addMessage(
    chatId: string,
    role: 'user' | 'assistant' | 'system',
    content: string,
    metadata?: Prisma.InputJsonValue,
  ) {
    return this.prisma.aiMessage.create({
      data: {
        chatId,
        role,
        content,
        metadata,
      },
    });
  }

  async getChatsByPage(pageId: string) {
    return this.prisma.aiChat.findMany({
      where: { pageId },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' },
          take: 1, // Only first message for title preview
        },
      },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async getChatWithMessages(chatId: string) {
    return this.prisma.aiChat.findUnique({
      where: { id: chatId },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' },
        },
      },
    });
  }

  async deleteChat(chatId: string) {
    return this.prisma.aiChat.delete({
      where: { id: chatId },
    });
  }

  async updateChatTitle(chatId: string, title: string) {
    return this.prisma.aiChat.update({
      where: { id: chatId },
      data: { title },
    });
  }
}
