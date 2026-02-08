import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/database/prisma/prisma.service';
import { CreatePageDto } from './dto/create-page.dto';
import { UpdatePageDto } from './dto/update-page.dto';
import { Prisma } from 'generated/prisma/client';

@Injectable()
export class PagesService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Default empty Craft.js content
   */
  private getDefaultContent() {
    return {
      ROOT: {
        type: { resolvedName: 'NodeContainer' },
        isCanvas: true,
        props: {
          padding: 24,
          backgroundColor: '#ffffff',
          flexDirection: 'column',
          gap: 16,
        },
        displayName: 'Container',
        custom: {},
        hidden: false,
        nodes: [],
        linkedNodes: {},
      },
    };
  }

  /**
   * Check if user owns the website containing this page
   */
  private async validateWebsiteOwnership(websiteId: string, userId: string) {
    const website = await this.prisma.website.findUnique({
      where: { id: websiteId },
    });

    if (!website) {
      throw new NotFoundException('Website not found');
    }

    if (website.userId !== userId) {
      throw new ForbiddenException('You do not own this website');
    }

    return website;
  }

  async create(userId: string, dto: CreatePageDto) {
    // Validate ownership
    await this.validateWebsiteOwnership(dto.websiteId, userId);

    // Check for duplicate slug within website
    const existing = await this.prisma.page.findUnique({
      where: {
        websiteId_slug: {
          websiteId: dto.websiteId,
          slug: dto.slug,
        },
      },
    });

    if (existing) {
      throw new ForbiddenException(
        `Page with slug "${dto.slug}" already exists in this website`,
      );
    }

    return this.prisma.page.create({
      data: {
        websiteId: dto.websiteId,
        name: dto.name,
        slug: dto.slug,
        content: (dto.content ||
          this.getDefaultContent()) as Prisma.InputJsonValue,
      },
    });
  }

  async findOne(id: string, userId: string) {
    const page = await this.prisma.page.findUnique({
      where: { id },
      include: { website: true },
    });

    if (!page) {
      throw new NotFoundException('Page not found');
    }

    // Check ownership via website
    if (page.website.userId !== userId) {
      throw new ForbiddenException('You do not own this page');
    }

    return page;
  }

  async update(id: string, userId: string, dto: UpdatePageDto) {
    // Validate ownership
    await this.findOne(id, userId);

    const data: Prisma.PageUpdateInput = {};
    if (dto.name) data.name = dto.name;
    if (dto.content) data.content = dto.content as Prisma.InputJsonValue;

    return this.prisma.page.update({
      where: { id },
      data,
    });
  }

  async publish(id: string, userId: string) {
    // Validate ownership
    await this.findOne(id, userId);

    return this.prisma.page.update({
      where: { id },
      data: {
        isPublished: true,
        publishedAt: new Date(),
      },
    });
  }

  async unpublish(id: string, userId: string) {
    // Validate ownership
    await this.findOne(id, userId);

    return this.prisma.page.update({
      where: { id },
      data: {
        isPublished: false,
        publishedAt: null,
      },
    });
  }

  /**
   * Public endpoint - no auth required
   */
  async findPublicPage(subdomain: string, slug: string) {
    const page = await this.prisma.page.findFirst({
      where: {
        slug,
        isPublished: true,
        website: { subdomain },
      },
      select: {
        id: true,
        name: true,
        slug: true,
        content: true,
        publishedAt: true,
        website: {
          select: {
            name: true,
            subdomain: true,
          },
        },
      },
    });

    if (!page) {
      throw new NotFoundException('Page not found or not published');
    }

    return page;
  }
}
