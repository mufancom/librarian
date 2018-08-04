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

export class UserNotFoundException extends LibrarianHttpException {
  constructor(message = 'User not found') {
    super('USER_NOT_FOUND', message);
  }
}

export class UsernameAlreadyExistsException extends LibrarianHttpException {
  constructor(message = 'Username already exists') {
    super('USERNAME_ALREADY_EXISTS', message);
  }
}

export class EmailAlreadyExistsException extends LibrarianHttpException {
  constructor(message = 'Email already exists') {
    super('EMAIL_ALREADY_EXISTS', message);
  }
}
