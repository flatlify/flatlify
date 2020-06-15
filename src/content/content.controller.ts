import {
  Controller,
  Get,
  Put,
  Post,
  Delete,
  Query,
  Param,
  Body,
} from '@nestjs/common';
import { ContentService } from './content.service';
import { IGetMany, IQueryIds } from './content.interfaces';

@Controller('content')
export class ContentController {
  constructor(private readonly contentService: ContentService) {}

  @Get(':contentType')
  getMany(
    @Query() query: IGetMany,
    @Param('contentType') contentType: string,
  ): Promise<any[]> {
    return this.contentService.getMany(contentType, {
      pagination: { page: query.page, perPage: query.perPage },
      sort: { order: query.order, field: query.field },
      ids: query.ids,
    });
  }

  @Get(':contentType/:id')
  getOne(
    @Param('contentType') contentType: string,
    @Param('id') id: string,
    @Body() data: any,
  ): Promise<any> {
    return this.contentService.getOne(contentType, id);
  }

  @Put(':contentType')
  updateMany(
    @Param('contentType') contentType: string,
    @Query() query: IQueryIds,
    @Body() data: any,
  ): Promise<any[]> {
    return this.contentService.updateMany(contentType, query.ids, document => ({
      ...document,
      ...data,
    }));
  }

  @Put(':contentType/:id')
  updateOne(
    @Param('contentType') contentType: string,
    @Param('id') id: string,
    @Body() data: any,
  ): Promise<any> {
    return this.contentService.updateOne(contentType, id, document => ({
      ...document,
      ...data,
    }));
  }

  @Post(':contentType')
  createOne(
    @Param('contentType') contentType: string,
    @Body() data: any,
  ): Promise<any> {
    return this.contentService.createOne(contentType, data);
  }

  @Delete(':contentType')
  deleteMany(
    @Param('contentType') contentType: string,
    @Query() query: IQueryIds,
  ): Promise<any[]> {
    return this.contentService.deleteMany(contentType, query.ids);
  }

  @Delete(':contentType/:id')
  deleteOne(
    @Param('contentType') contentType: string,
    @Param('id') id: string,
  ): Promise<any> {
    return this.contentService.deleteOne(contentType, id);
  }
}
