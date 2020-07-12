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
import { IGetMany, IQueryIds as IBodyIds } from './content.interfaces';

@Controller('content')
export class ContentController {
  constructor(private readonly contentService: ContentService) {}

  @Get('collections/:contentType')
  getMany(
    @Query() query: IGetMany,
    @Param('contentType') contentType: string,
  ): Promise<any[]> {
    return this.contentService.getMany(contentType, {
      pagination: { limit: query.limit, start: query.start },
      sort: { order: query.order, field: query.field },
      ids: query.ids,
    });
  }

  @Get('collections/:contentType/:id')
  getOne(
    @Param('contentType') contentType: string,
    @Param('id') id: string,
  ): Promise<any> {
    return this.contentService.getOne(contentType, id);
  }

  @Put('collections/:contentType')
  updateMany(
    @Param('contentType') contentType: string,
    @Body() body: IBodyIds,
  ): Promise<any[]> {
    return this.contentService.updateMany(contentType, body.ids, document => ({
      ...document,
      ...body.data,
    }));
  }

  @Put('collections/:contentType/:id')
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

  @Post('collections/:contentType')
  createOne(
    @Param('contentType') contentType: string,
    @Body() data: any,
  ): Promise<any> {
    return this.contentService.createOne(contentType, data);
  }

  @Delete('collections/:contentType')
  deleteMany(
    @Param('contentType') contentType: string,
    @Body() body: IBodyIds,
  ): Promise<any[]> {
    return this.contentService.deleteMany(contentType, body.ids);
  }

  @Delete('collections/:contentType/:id')
  deleteOne(
    @Param('contentType') contentType: string,
    @Param('id') id: string,
  ): Promise<any> {
    return this.contentService.deleteOne(contentType, id);
  }
}