import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Res, T } from 'libs/system/src';
import { map, Observable } from 'rxjs';

@Injectable()
export class HttpResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<Res<T>> {
    return next.handle().pipe(
      map((data) => {
        return {
          code: 0,
          data,
          error: null,
          message: 'ok',
        };
      }),
    );
  }
}
