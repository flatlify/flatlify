import {
  Controller,
  Get,
  Put,
  Post,
  Delete,
  Query,
  Param,
  Body,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ContentService } from './content.service';
import { IGetMany } from './content.interfaces';

@Controller('content')
export class ContentController {
  constructor(private readonly contentService: ContentService) {}

  @Get(':contentType')
  getMany(
    @Query() query: IGetMany,
    @Param('contentType') contentType: string,
  ): Promise<any[]> {
    return this.contentService.getMany(contentType, {
      pagination: { limit: query.limit, start: query.start },
      sort: { order: query.order, field: query.field },
      id: query.id,
    });
  }

  @Get(':contentType/:id')
  async getOne(
    @Param('contentType') contentType: string,
    @Param('id') id: string,
  ): Promise<any> {
    const document = await this.contentService.getOne(contentType, id);
    return document;
  }

  @Put(':contentType/:id')
  async update(
    @Param('contentType') contentType: string,
    @Param('id') id: string,
    @Body() data: Record<string, unknown>,
  ): Promise<any> {
    const document = await this.contentService.update(
      contentType,
      id,
      document => ({
        ...document,
        ...data,
      }),
    );
    return document;
  }

  @Post(':contentType')
  create(
    @Param('contentType') contentType: string,
    @Body() data: Record<string, unknown>,
  ): Promise<any> {
    return this.contentService.create(contentType, data);
  }

  @Delete(':contentType/:id')
  async delete(
    @Param('contentType') contentType: string,
    @Param('id') id: string,
  ): Promise<any> {
    const document = await this.contentService.delete(contentType, id);
    return document;
  }
}
