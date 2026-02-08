import { Test, TestingModule } from '@nestjs/testing';
import { PublicController } from './public.controller';
import { PagesService } from '../pages/pages.service';

describe('PublicController', () => {
  let controller: PublicController;

  const mockPagesService = {
    findPublicPage: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PublicController],
      providers: [{ provide: PagesService, useValue: mockPagesService }],
    }).compile();

    controller = module.get<PublicController>(PublicController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getPublicPage', () => {
    it('should return a public page', async () => {
      const result = { id: '1', name: 'Public Page' };
      mockPagesService.findPublicPage.mockResolvedValue(result);

      expect(await controller.getPublicPage('subdomain', 'slug')).toBe(result);
      expect(mockPagesService.findPublicPage).toHaveBeenCalledWith(
        'subdomain',
        'slug',
      );
    });
  });
});
