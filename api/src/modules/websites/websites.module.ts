import { Module } from '@nestjs/common';
import { WebsitesService } from './websites.service';
import { WebsitesController } from './websites.controller';
import { PrismaModule } from 'src/database/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [WebsitesController],
  providers: [WebsitesService],
  exports: [WebsitesService],
})
export class WebsitesModule {}
