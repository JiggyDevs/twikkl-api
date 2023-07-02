import { HttpException, HttpStatus } from '@nestjs/common';

export class AlreadyExistsException extends HttpException {
  constructor(message: string) {
    super(message, HttpStatus.CONFLICT);
  }
}

export class DoesNotExistsException extends HttpException {
  constructor(message: string) {
    super(message, HttpStatus.NOT_FOUND);
  }
}

export class BadRequestsException extends HttpException {
  constructor(message: string) {
    super(message, HttpStatus.BAD_REQUEST);
  }
}

export class UnAuthorizedException extends HttpException {
  constructor(message: string) {
    super(message, HttpStatus.UNAUTHORIZED);
  }
}

export class TooManyRequestsException extends HttpException {
  constructor(message: string) {
    super(message, HttpStatus.TOO_MANY_REQUESTS);
  }
}

export class ForbiddenRequestException extends HttpException{
  constructor(message: string) {
    super(message, HttpStatus.FORBIDDEN);
  }
}