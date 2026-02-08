import { Test, TestingModule } from '@nestjs/testing';
import { WebsitesService } from './websites.service';
import { PrismaService } from '../../database/prisma/prisma.service';
import {
  ConflictException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';

describe('WebsitesService', () => {
  let service: WebsitesService;

  const mockPrismaService = {
    website: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WebsitesService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<WebsitesService>(WebsitesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a website with generated subdomain if not provided', async () => {
      const dto = { name: 'Hello World' };
      const userId = '1';

      mockPrismaService.website.findUnique.mockResolvedValue(null); // No conflict
      mockPrismaService.website.create.mockResolvedValue({
        id: '1',
        name: 'Hello World',
        subdomain: 'hello-world',
      });

      const result = await service.create(userId, dto);

      expect(result).toHaveProperty('subdomain', 'hello-world');
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      const createArgs = (mockPrismaService.website.create as any).mock
        .calls[0][0];
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      expect(createArgs.data.subdomain).toBe('hello-world');
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      expect(createArgs.data.name).toBe('Hello World');
    });

    it('should throw ConflictException if subdomain taken', async () => {
      mockPrismaService.website.findUnique.mockResolvedValue({ id: '2' });
      await expect(
        service.create('1', { name: 'test', subdomain: 'test' }),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('findOne', () => {
    it('should return website if user owns it', async () => {
      const website = { id: '1', userId: '1' };
      mockPrismaService.website.findUnique.mockResolvedValue(website);

      const result = await service.findOne('1', '1');
      expect(result).toBe(website);
    });

    it('should throw ForbiddenException if user does not own it', async () => {
      const website = { id: '1', userId: '2' };
      mockPrismaService.website.findUnique.mockResolvedValue(website);

      await expect(service.findOne('1', '1')).rejects.toThrow(
        ForbiddenException,
      );
    });

    it('should throw NotFoundException if not found', async () => {
      mockPrismaService.website.findUnique.mockResolvedValue(null);
      await expect(service.findOne('1', '1')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
