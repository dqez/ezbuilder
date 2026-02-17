import { IsString, IsNotEmpty, IsOptional, IsObject } from 'class-validator';

export class ChatMessageDto {
  @IsOptional()
  @IsString()
  chatId?: string; // null = new chat

  @IsString()
  @IsNotEmpty()
  pageId: string;

  @IsString()
  @IsNotEmpty()
  message: string;

  @IsOptional()
  @IsObject()
  canvasState?: any; // Craft.js serialized state

  @IsString()
  @IsOptional()
  selectedNode?: string;
}
