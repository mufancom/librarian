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

export class ValidationException extends LibrarianHttpException {
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

export class UnnecessaryRequestException extends LibrarianHttpException {
  constructor(message = 'UNNECESSARY_REQUEST') {
    super('UNNECESSARY_REQUEST', message);
  }
}
