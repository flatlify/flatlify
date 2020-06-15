import { Injectable } from '@nestjs/common';

@Injectable()
export class ContentService {
    @Get(':contentType')
    getMany(): string {
      return 'This action adds a new cat';
    }
  
    @Get(':contentType/:itemId')
    getOne(): string {
      return 'This action adds a new cat';
    }
  
    @Put(':contentType')
    updateMany(): string {
      return 'This action adds a new cat';
    }
  
    @Put(':contentType/:itemId')
    updateOne(): string {
      return 'This action adds a new cat';
    }
  
    @Post(':contentType')
    createOne(): string {
      return 'This action adds a new cat';
    }
  
    @Delete(':contentType')
    deleteOne(): string {
      return 'This action adds a new cat';
    }
  
    @Delete(':contentType/:itemId')
    deleteMany(): string {
      return 'This action adds a new cat';
    }
}
