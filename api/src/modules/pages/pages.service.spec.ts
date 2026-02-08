import { Test, TestingModule } from '@nestjs/testing';
import { PagesService } from './pages.service';
import { PrismaService } from '../../database/prisma/prisma.service';
import { ForbiddenException } from '@nestjs/common';

describe('PagesService', () => {
  let service: PagesService;

  const mockPrismaService = {
    website: {
      findUnique: jest.fn(),
    },
    page: {
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PagesService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<PagesService>(PagesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create page if website belongs to user', async () => {
      mockPrismaService.website.findUnique.mockResolvedValue({
        id: '1',
        userId: '1',
      });
      mockPrismaService.page.findUnique.mockResolvedValue(null); // No duplicate slug

      const dto = { name: 'Home', slug: 'home', websiteId: '1' };
      const result = { id: '1', ...dto };
      mockPrismaService.page.create.mockResolvedValue(result);

      expect(await service.create('1', dto)).toBe(result);
    });

    it('should throw ForbiddenException if user doesnt own website', async () => {
      mockPrismaService.website.findUnique.mockResolvedValue({
        id: '1',
        userId: '2',
      });
      const dto = { name: 'Home', slug: 'home', websiteId: '1' };
      await expect(service.create('1', dto)).rejects.toThrow(
        ForbiddenException,
      );
    });
  });

  describe('findOne', () => {
    it('should return page if owned by user', async () => {
      const page = { id: '1', website: { userId: '1' } };
      mockPrismaService.page.findUnique.mockResolvedValue(page);

      expect(await service.findOne('1', '1')).toBe(page);
    });
  });
});
