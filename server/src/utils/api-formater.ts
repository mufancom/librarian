import {HttpException, HttpStatus} from '@nestjs/common';

export namespace api {
  export function success(data?: object, message?: string): object {
    return {
      code: 200,
      data,
      msg: message,
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
        msg: message,
      },
      statusCode,
    );
  }
}
