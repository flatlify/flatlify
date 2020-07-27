import { HttpException, HttpStatus } from '@nestjs/common';

export class CollectionNotFound extends HttpException {
  constructor() {
    super('Collection not found', HttpStatus.NOT_FOUND);
  }
}
