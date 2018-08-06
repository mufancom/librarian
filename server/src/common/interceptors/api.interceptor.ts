import {ExecutionContext, Injectable, NestInterceptor} from '@nestjs/common';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

export interface Response<T> {
  data: T;
}

@Injectable()
export class APIInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(_context: ExecutionContext, call$: Observable<T>): Observable<any> {
    return call$.pipe(map(data => ({data})));
  }
}
