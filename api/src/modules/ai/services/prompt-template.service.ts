import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma/prisma.service';

@Injectable()
export class PromptTemplateService {
  constructor(private prisma: PrismaService) {}

  async getSystemTemplates() {
    let templates = await this.prisma.aiPromptTemplate.findMany({
      where: { isSystem: true },
      orderBy: { sortOrder: 'asc' },
    });

    if (templates.length === 0) {
      // Seed default templates
      await this.prisma.aiPromptTemplate.createMany({
        data: [
          {
            name: 'Tạo Hero',
            category: 'section',
            prompt:
              'Tạo một hero section với tiêu đề, phụ đề và nút CTA nổi bật.',
            isSystem: true,
            sortOrder: 1,
          },
          {
            name: 'Thêm tính năng',
            category: 'section',
            prompt:
              'Thêm một section giới thiệu với 3 tính năng dạng thẻ (card), bao gồm icon, tiêu đề và mô tả ngắn.',
            isSystem: true,
            sortOrder: 2,
          },
          {
            name: 'Thêm Form',
            category: 'component',
            prompt:
              'Thêm một contact form đơn giản gồm Tên, Email, và Nút gửi.',
            isSystem: true,
            sortOrder: 3,
          },
          {
            name: 'Tạo Footer',
            category: 'section',
            prompt:
              'Tạo một footer tối giản chứa thông tin bản quyền và link hữu ích.',
            isSystem: true,
            sortOrder: 4,
          },
        ],
      });
      templates = await this.prisma.aiPromptTemplate.findMany({
        where: { isSystem: true },
        orderBy: { sortOrder: 'asc' },
      });
    }

    return templates;
  }
}
