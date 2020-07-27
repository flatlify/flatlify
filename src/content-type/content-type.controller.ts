import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ContentTypeService } from './content-type.service';

@Controller('content-type')
export class ContentTypeController {
  constructor(private readonly contentTypeService: ContentTypeService) {}

  @Get('')
  list(): Promise<any[]> {
    return this.contentTypeService.list();
  }

  @Post(':contentType')
  async createOne(@Param('contentType') contentType: string): Promise<any> {
    try {
      const createdType = await this.contentTypeService.create(contentType);
      return { name: createdType };
    } catch (err) {
      if (err.code === 'EEXIST') {
        throw new HttpException(
          {
            status: HttpStatus.CONFLICT,
            error: 'Collection already exists',
          },
          HttpStatus.CONFLICT,
        );
      } else {
        throw err;
      }
    }
  }

  @Delete(':contentType')
  async delete(@Param('contentType') contentType: string): Promise<any> {
    await this.contentTypeService.delete(contentType);
  }
}
