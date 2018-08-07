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
  constructor(message = 'Invalid arguments') {
    super('INVALID_ARGUMENTS', message);
  }
}

export class ValidationFailedException extends LibrarianHttpException {
  constructor(message = 'Validation failed') {
    super('VALIDATION_FAILED', message);
  }
}

export class AuthenticationFailedException extends LibrarianHttpException {
  constructor(message = 'Authentication failed') {
    super('AUTHENTICATION_FAILED', message);
  }
}

export class ResourceNotFoundException extends LibrarianHttpException {
  constructor(message = 'Resource not found') {
    super('RESOURCE_NOT_FOUND', message);
  }
}

export class FieldAlreadyExistsException extends LibrarianHttpException {
  constructor(message = 'Field already exists') {
    super('FIELD_ALREADY_EXISTS', message);
  }
}
