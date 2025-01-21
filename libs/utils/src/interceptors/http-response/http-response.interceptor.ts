import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';

interface T {}

interface Res<T> {
  data: T;
}

@Injectable()
export class HttpResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<Res<T>> {
    return next.handle().pipe(
      map((data) => {
        return {
          data,
        };
      }),
    );
  }
}
