import { Test, TestingModule } from '@nestjs/testing';
import { WebsitesController } from './websites.controller';
import { WebsitesService } from './websites.service';

describe('WebsitesController', () => {
  let controller: WebsitesController;

  const mockWebsitesService = {
    create: jest.fn(),
    findAllByUser: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WebsitesController],
      providers: [{ provide: WebsitesService, useValue: mockWebsitesService }],
    }).compile();

    controller = module.get<WebsitesController>(WebsitesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a website', async () => {
      const dto = { name: 'New Site', subdomain: 'new-site' };
      const user = { userId: '1', role: 'user' };
      const result = { id: '1', ...dto };
      mockWebsitesService.create.mockResolvedValue(result);

      expect(await controller.create(user, dto)).toBe(result);
      expect(mockWebsitesService.create).toHaveBeenCalledWith('1', dto);
    });
  });

  describe('findAll', () => {
    it('should return websites for a user', async () => {
      const user = { userId: '1', role: 'user' };
      const result = [{ id: '1', name: 'Site 1' }];
      mockWebsitesService.findAllByUser.mockResolvedValue(result);

      expect(await controller.findAll(user)).toBe(result);
      expect(mockWebsitesService.findAllByUser).toHaveBeenCalledWith('1');
    });
  });
});
