import { Module } from '@nestjs/common';
import { PublicController } from './public.controller';
import { PagesModule } from '../pages/pages.module';

@Module({
  imports: [PagesModule],
  controllers: [PublicController],
})
export class PublicModule {}
