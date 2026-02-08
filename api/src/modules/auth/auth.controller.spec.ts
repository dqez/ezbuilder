import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto } from './dto/auth.dto';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  const mockAuthService = {
    register: jest.fn(),
    login: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('register', () => {
    it('should register a new user', async () => {
      const dto: RegisterDto = {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
      };

      const result = {
        user: { id: '1', ...dto },
        accessToken: 'token',
        refreshToken: 'token',
      };
      mockAuthService.register.mockResolvedValue(result);

      expect(await controller.register(dto)).toBe(result);
      expect(mockAuthService.register).toHaveBeenCalledWith(dto);
    });
  });

  describe('login', () => {
    it('should login a user', async () => {
      const dto: LoginDto = {
        login: 'test@example.com',
        password: 'password123',
      };

      const result = {
        user: { id: '1', email: 'test@example.com' },
        accessToken: 'token',
        refreshToken: 'token',
      };
      mockAuthService.login.mockResolvedValue(result);

      expect(await controller.login(dto)).toBe(result);
      expect(mockAuthService.login).toHaveBeenCalledWith(dto);
    });
  });
});
