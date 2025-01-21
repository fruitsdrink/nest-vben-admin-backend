import { Res, T } from '@app/utils/types';
import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    // const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    // console.log('====');
    // console.dir(exception);
    if (exception instanceof BadRequestException) {
      const responseObject = exception.getResponse() as any;
      return response.status(HttpStatus.BAD_REQUEST).json({
        code: HttpStatus.BAD_REQUEST,
        message:
          responseObject.message && responseObject.message.map
            ? responseObject.message
                .map((error) => {
                  const jsonError = JSON.parse(error);
                  return jsonError.message ?? '';
                })
                .join(',')
            : exception.message,
        error:
          responseObject.message && responseObject.message.map
            ? responseObject.message.map((error) => {
                const jsonError = JSON.parse(error);
                return jsonError;
              })
            : exception.name,
      });
    }
    const status = exception.getStatus();

    const data: Res<T> = {
      code: status,
      message: exception.message,
      error: exception.name,
    };
    response.status(status).json(data);
  }
}
