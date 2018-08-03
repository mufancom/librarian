import {CanActivate, ExecutionContext, Injectable} from '@nestjs/common';
import {Request} from 'express';
import {Observable} from 'rxjs';

import {AuthService} from './auth.service';

import {User} from '../user/user.entity';

declare global {
  namespace Express {
    class Request {
      user: User;
    }
  }
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    return this.validateRequest(request);
  }

  async validateRequest(request: Request): Promise<boolean> {
    let session = request.session as Express.Session;

    if (session.user && session.user.id) {
      let user = await this.authService.findUserById(session.user.id);

      if (user) {
        request.user = user;
        return true;
      }
    }

    return false;
  }
}
