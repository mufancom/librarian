import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';

import {LibrarianHttpException} from '../exceptions';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    let context = host.switchToHttp();
    let response = context.getResponse();
    let status = exception.getStatus();

    let message = exception.message;

    if (!(exception instanceof LibrarianHttpException)) {
      message = {
        error: {
          code: (message.error as string).toUpperCase().replace(/\s+/g, '_'),
          message: message.message ? message.message : message,
        },
      };
    }

    response.status(status).json(message);
  }
}
