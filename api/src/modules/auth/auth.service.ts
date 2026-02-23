import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import type { StringValue } from 'ms';
import { LoginDto, RegisterDto } from './dto/auth.dto';
import * as bcrypt from 'bcrypt';
import { Prisma } from 'generated/prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  private saltRounds() {
    const v = this.configService.get<number>('bcrypt.saltRounds')!;
    return Number.isFinite(v) ? v : 12;
  }

  private async issueTokens(userId: string, role: string) {
    const accessSecret = this.configService.get<string>('jwt.accessSecret');
    const refreshSecret = this.configService.get<string>('jwt.refreshSecret');

    const accessTtl = this.configService.get<string>(
      'jwt.accessTtl',
    ) as StringValue;
    const refreshTtl = this.configService.get<string>(
      'jwt.refreshTtl',
    ) as StringValue;

    const payload = { sub: userId, role: role };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: accessSecret,
        expiresIn: accessTtl,
      }),
      this.jwtService.signAsync(payload, {
        secret: refreshSecret,
        expiresIn: refreshTtl,
      }),
    ]);

    return { accessToken, refreshToken };
  }

  async register(dto: RegisterDto) {
    const passwordHash = await bcrypt.hash(dto.password, this.saltRounds());

    try {
      const user = await this.usersService.createCredentialsUser({
        name: dto.name,
        email: dto.email,
        passwordHash,
      });

      const tokens = await this.issueTokens(user.id, user.role);
      return { user, ...tokens };
    } catch (e: any) {
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === 'P2002'
      ) {
        throw new ForbiddenException('Account already exists');
      }
      throw e;
    }
  }

  async login(dto: LoginDto) {
    const user = await this.usersService.findByEmailOrPhone(dto.login);

    if (!user) throw new UnauthorizedException('Invalid credentials');
    if (!user.isActive) throw new ForbiddenException('Account is disabled');

    if (!user.password) {
      throw new UnauthorizedException('Please login with Google');
    }

    const ok = await bcrypt.compare(dto.password, user.password);
    if (!ok) throw new UnauthorizedException('Invalid credentials');

    const safeUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
      createAt: user.createdAt,
    };

    const tokens = await this.issueTokens(user.id, user.role);

    return { user: safeUser, ...tokens };
  }

  async googleLogin(req: {
    user: { email: string; name: string; avatarUrl?: string };
  }) {
    if (!req.user) {
      throw new UnauthorizedException('No user from google');
    }

    const user = await this.usersService.findOrCreateGoogleUser({
      email: req.user.email,
      name: req.user.name,
      avatarUrl: req.user.avatarUrl,
    });

    if (!user.isActive) throw new ForbiddenException('Account is disabled');

    const safeUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
      createAt: user.createdAt,
    };

    const tokens = await this.issueTokens(user.id, user.role);

    return { user: safeUser, ...tokens };
  }

  async getMe(userId: string) {
    const user = await this.usersService.findById(userId);
    if (!user) throw new UnauthorizedException('User not found');
    return user;
  }
}
