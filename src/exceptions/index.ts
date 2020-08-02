import { HttpException, HttpStatus } from '@nestjs/common';

export class CollectionNotFound extends HttpException {
  constructor() {
    super('Collection not found', HttpStatus.NOT_FOUND);
  }
}

export class FileNotFound extends HttpException {
  constructor() {
    super('File not found', HttpStatus.NOT_FOUND);
  }
}
