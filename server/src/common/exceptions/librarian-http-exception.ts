import {HttpException, HttpStatus} from '@nestjs/common';

export class LibrarianHttpException extends HttpException {
  constructor(code: string, message: string) {
    super(
      {
        error: {
          code,
          message,
        },
      },
      HttpStatus.OK,
    );
  }
}

export class InvalidArgumentsException extends LibrarianHttpException {
  constructor(message = 'INVALID_ARGUMENTS') {
    super('INVALID_ARGUMENTS', message);
  }
}

export class ValidationFailedException extends LibrarianHttpException {
  constructor(message = 'VALIDATION_FAILED') {
    super('VALIDATION_FAILED', message);
  }
}

export class AuthenticationFailedException extends LibrarianHttpException {
  constructor(message = 'AUTHENTICATION_FAILED') {
    super('AUTHENTICATION_FAILED', message);
  }
}

export class ResourceNotFoundException extends LibrarianHttpException {
  constructor(message = 'RESOURCE_NOT_FOUND') {
    super('RESOURCE_NOT_FOUND', message);
  }
}

export class ResourceConflictingException extends LibrarianHttpException {
  constructor(message = 'RESOURCE_CONFLICTING') {
    super('RESOURCE_CONFLICTING', message);
  }
}
