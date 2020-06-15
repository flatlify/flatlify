import { Controller, Get, Put, Post, Delete } from '@nestjs/common';

@Controller('content')
export class ContentController {
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

  //   router.get("/:contentType", getMany);
  //   router.get("/:contentType/:itemId", getOne);
  //   router.put("/:contentType/:itemId", updateOne);
  //   router.put("/:contentType", updateMany);
  //   router.post("/:contentType", createOne);
  //   router.delete("/:contentType/:itemId", deleteOne);
  //   router.delete("/:contentType", deleteMany);
}
