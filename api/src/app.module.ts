import { Module } from '@nestjs/common';
import { PrismaModule } from './database/prisma/prisma.module';
import configuration from './config/configuration';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
    PrismaModule,
    UsersModule,
    AuthModule,
  ],
})
export class AppModule {}
