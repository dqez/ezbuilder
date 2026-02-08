import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UnauthorizedException, ForbiddenException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  const mockUsersService = {
    createCredentialsUser: jest.fn(),
    findByEmailOrPhone: jest.fn(),
  };

  const mockJwtService = {
    signAsync: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn((key: string) => {
      if (key === 'bcrypt.saltRounds') return 10;
      if (key === 'jwt.accessSecret') return 'secret';
      if (key === 'jwt.refreshSecret') return 'secret';
      if (key === 'jwt.accessTtl') return '15m';
      if (key === 'jwt.refreshTtl') return '7d';
      return null;
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: mockUsersService },
        { provide: JwtService, useValue: mockJwtService },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('login', () => {
    it('should return tokens if validation is successful', async () => {
      const dto = { login: 'test@example.com', password: 'password' };
      const user = {
        id: '1',
        email: 'test@example.com',
        password: await bcrypt.hash('password', 10),
        role: 'user',
        isActive: true,
        createdAt: new Date(),
        name: 'Test',
      };

      mockUsersService.findByEmailOrPhone.mockResolvedValue(user);
      mockJwtService.signAsync.mockResolvedValue('token');

      const result = await service.login(dto);

      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
      expect(result).toHaveProperty('user');
    });

    it('should throw UnauthorizedException if user not found', async () => {
      mockUsersService.findByEmailOrPhone.mockResolvedValue(null);
      await expect(
        service.login({ login: 'wrong', password: 'p' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if password incorrect', async () => {
      const user = {
        id: '1',
        email: 'test@example.com',
        password: await bcrypt.hash('password', 10),
        isActive: true,
      };
      mockUsersService.findByEmailOrPhone.mockResolvedValue(user);
      await expect(
        service.login({ login: 'test', password: 'wrong' }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });
});
