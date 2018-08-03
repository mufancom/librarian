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

export namespace API {
  export function success(data?: object, message?: string): object {
    return {
      code: 200,
      data,
      message,
    };
  }

  export function error(
    message: string,
    code: number,
    statusCode: number = HttpStatus.BAD_REQUEST,
  ): HttpException {
    return new HttpException(
      {
        code,
        message,
      },
      statusCode,
    );
  }
}
