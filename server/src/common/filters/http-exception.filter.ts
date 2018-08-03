import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse();
    const status = exception.getStatus();

    let message = exception.message;

    if (message.msg && message.code) {
      response.status(status).json(message);
    } else {
      response.status(status).json({
        code: status,
        msg: message.message ? message.message : message,
      });
    }
  }
}
