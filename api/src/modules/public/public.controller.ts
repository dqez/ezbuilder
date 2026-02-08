import { Controller, Get, Param } from '@nestjs/common';
import { PagesService } from '../pages/pages.service';

@Controller('public')
export class PublicController {
  constructor(private readonly pagesService: PagesService) {}

  @Get(':subdomain/:slug')
  getPublicPage(
    @Param('subdomain') subdomain: string,
    @Param('slug') slug: string,
  ) {
    return this.pagesService.findPublicPage(subdomain, slug);
  }
}
