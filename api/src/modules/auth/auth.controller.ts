import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './dto/auth.dto';
import type { Request, Response } from 'express';

import { ConfigService } from '@nestjs/config';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @Post('register')
  @HttpCode(201)
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  @HttpCode(200)
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Get('google')
  googleAuth(@Req() req: Request, @Res() res: Response) {
    const referer =
      req.get('referer') ||
      req.get('origin') ||
      this.configService.get<string>('frontendUrl') ||
      'http://localhost:3000';
    const url = new URL(String(referer));

    // We redirect to a dedicated endpoint that triggers passport
    // This allows us to pass state cleanly without manual passport invocation
    res.redirect(`/api/v1/auth/google/trigger?state=${url.origin}`);
  }

  @Get('google/trigger')
  @UseGuards(AuthGuard('google'))
  async googleAuthTrigger() {
    // Guards redirect
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(
    @Req()
    req: {
      user: { email: string; name: string; avatarUrl?: string };
      query: { state?: string };
    },
    @Res() res: Response,
  ) {
    const { accessToken, refreshToken } =
      await this.authService.googleLogin(req);
    // Redirect back to frontend
    let frontendUrl =
      this.configService.get<string>('frontendUrl') ?? 'http://localhost:3000';

    if (
      req.query.state &&
      (req.query.state.startsWith('http://') ||
        req.query.state.startsWith('https://'))
    ) {
      frontendUrl = req.query.state;
    }

    res.redirect(
      `${frontendUrl}/google-callback?token=${accessToken}&refresh=${refreshToken}`,
    );
  }

  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  getMe(@Req() req: { user: { userId: string } }) {
    return this.authService.getMe(req.user.userId);
  }
}
