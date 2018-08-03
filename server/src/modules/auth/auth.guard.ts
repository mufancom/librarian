import {CanActivate, ExecutionContext, Injectable} from '@nestjs/common';
import {Request} from 'express';
import {Observable} from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    return validateRequest(request);
  }
}

async function validateRequest(request: Request): Promise<boolean> {
  console.log(request);
  let {
    userId,
    accessToken,
  }: {userId: number; accessToken: string} = request.body;
  if (userId && accessToken) {
  }
  return false;
}
