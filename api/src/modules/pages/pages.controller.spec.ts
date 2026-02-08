import { Test, TestingModule } from '@nestjs/testing';
import { PagesController } from './pages.controller';
import { PagesService } from './pages.service';

describe('PagesController', () => {
  let controller: PagesController;

  const mockPagesService = {
    create: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    publish: jest.fn(),
    unpublish: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PagesController],
      providers: [{ provide: PagesService, useValue: mockPagesService }],
    }).compile();

    controller = module.get<PagesController>(PagesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a page', async () => {
      const dto = { name: 'Home', slug: 'home', websiteId: '1' };
      const user = { userId: '1', role: 'user' };
      const result = { id: '1', ...dto };
      mockPagesService.create.mockResolvedValue(result);

      expect(await controller.create(user, dto)).toBe(result);
      expect(mockPagesService.create).toHaveBeenCalledWith('1', dto);
    });
  });

  describe('publish', () => {
    it('should publish a page', async () => {
      const user = { userId: '1', role: 'user' };
      const result = { id: '1', isPublished: true };
      mockPagesService.publish.mockResolvedValue(result);

      expect(await controller.publish(user, '1')).toBe(result);
      expect(mockPagesService.publish).toHaveBeenCalledWith('1', '1');
    });
  });
});
