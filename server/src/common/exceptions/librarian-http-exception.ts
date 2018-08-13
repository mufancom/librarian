import {HttpException, HttpStatus} from '@nestjs/common';
import {Translation} from 'shared/translation';

export class LibrarianHttpException extends HttpException {
  constructor(code: string, message: keyof Translation) {
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
  constructor(message: keyof Translation = 'INVALID_ARGUMENTS') {
    super('INVALID_ARGUMENTS', message);
  }
}

export class ValidationException extends LibrarianHttpException {
  constructor(message: keyof Translation = 'VALIDATION_FAILED') {
    super('VALIDATION_FAILED', message);
  }
}

export class AuthenticationFailedException extends LibrarianHttpException {
  constructor(message: keyof Translation = 'AUTHENTICATION_FAILED') {
    super('AUTHENTICATION_FAILED', message);
  }
}

export class ResourceNotFoundException extends LibrarianHttpException {
  constructor(message: keyof Translation = 'RESOURCE_NOT_FOUND') {
    super('RESOURCE_NOT_FOUND', message);
  }
}

export class ResourceConflictingException extends LibrarianHttpException {
  constructor(message: keyof Translation = 'RESOURCE_CONFLICTING') {
    super('RESOURCE_CONFLICTING', message);
  }
}

export class UnnecessaryRequestException extends LibrarianHttpException {
  constructor(message: keyof Translation = 'UNNECESSARY_REQUEST') {
    super('UNNECESSARY_REQUEST', message);
  }
}
