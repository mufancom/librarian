import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    // const request = ctx.getRequest();
    const status = exception.getStatus();

    if (exception.message.msg && exception.message.code) {
      response.status(status).json(exception.message);
    } else {
      response.status(status).json({
        code: status,
        msg: exception.message.message
          ? exception.message.message
          : exception.message,
      });
    }
  }
}
