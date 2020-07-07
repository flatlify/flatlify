import { Controller, Get, Post, Delete, Param, Query } from '@nestjs/common';
import { ContentTypeService } from './content-type.service';

@Controller('content-type')
export class ContentTypeController {
  constructor(private readonly contentTypeService: ContentTypeService) {}

  @Get('collections')
  list(): Promise<any[]> {
    return this.contentTypeService.list();
  }

  @Post('collections/:contentType')
  createOne(@Param('contentType') contentType: string): Promise<any> {
    return this.contentTypeService.create(contentType);
  }

  @Delete('collections/:contentType')
  delete(@Param('contentType') contentType: string): Promise<any[]> {
    return this.contentTypeService.delete(contentType);
  }
}
