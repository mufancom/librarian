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
    const context = host.switchToHttp();
    const response = context.getResponse();
    const status = exception.getStatus();
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
