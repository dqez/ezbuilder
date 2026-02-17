import { Module } from '@nestjs/common';
import { PrismaModule } from './database/prisma/prisma.module';
import configuration from './config/configuration';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { WebsitesModule } from './modules/websites/websites.module';
import { PagesModule } from './modules/pages/pages.module';
import { PublicModule } from './modules/public/public.module';
import { AiModule } from './modules/ai/ai.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
    PrismaModule,
    UsersModule,
    AuthModule,
    WebsitesModule,
    PagesModule,
    PublicModule,
    AiModule,
  ],
})
export class AppModule {}
