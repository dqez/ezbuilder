import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/database/prisma/prisma.service';
import { CreateWebsiteDto } from './dto/create-website.dto';
import { UpdateWebsiteDto } from './dto/update-website.dto';

@Injectable()
export class WebsitesService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Generate subdomain from name if not provided
   */
  private generateSubdomain(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric with hyphen
      .replace(/^-+|-+$/g, ''); // Trim hyphens from start/end
  }

  async create(userId: string, dto: CreateWebsiteDto) {
    const subdomain = dto.subdomain || this.generateSubdomain(dto.name);

    // Check subdomain uniqueness
    const existing = await this.prisma.website.findUnique({
      where: { subdomain },
    });

    if (existing) {
      throw new ConflictException(`Subdomain "${subdomain}" is already taken`);
    }

    return this.prisma.website.create({
      data: {
        name: dto.name,
        subdomain,
        description: dto.description,
        userId,
      },
      include: {
        pages: true,
      },
    });
  }

  async findAllByUser(userId: string) {
    return this.prisma.website.findMany({
      where: { userId },
      include: {
        pages: {
          select: {
            id: true,
            name: true,
            slug: true,
            isPublished: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string, userId: string) {
    const website = await this.prisma.website.findUnique({
      where: { id },
      include: {
        pages: true,
      },
    });

    if (!website) {
      throw new NotFoundException('Website not found');
    }

    if (website.userId !== userId) {
      throw new ForbiddenException('You do not own this website');
    }

    return website;
  }

  async update(id: string, userId: string, dto: UpdateWebsiteDto) {
    // Check ownership
    await this.findOne(id, userId);

    // If subdomain is being changed, check uniqueness
    if (dto.subdomain) {
      const existing = await this.prisma.website.findUnique({
        where: { subdomain: dto.subdomain },
      });

      if (existing && existing.id !== id) {
        throw new ConflictException(
          `Subdomain "${dto.subdomain}" is already taken`,
        );
      }
    }

    return this.prisma.website.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string, userId: string) {
    // Check ownership
    await this.findOne(id, userId);

    // Cascade delete will handle pages
    await this.prisma.website.delete({
      where: { id },
    });

    return { message: 'Website deleted successfully' };
  }
}
