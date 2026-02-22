import { Module } from '@nestjs/common';
import { AiController } from './ai.controller';
import { AiService } from './ai.service';
import { ChatHistoryService } from './services/chat-history.service';
import { PromptBuilderService } from './prompts/prompt-builder.service';
import { PromptTemplateService } from './services/prompt-template.service';
import { PrismaModule } from '../../database/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [AiController],
  providers: [
    AiService,
    ChatHistoryService,
    PromptTemplateService,
    PromptBuilderService,
  ],
})
export class AiModule {}
