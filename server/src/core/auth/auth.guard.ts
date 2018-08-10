import {CanActivate, ExecutionContext, Injectable} from '@nestjs/common';
import {Request} from 'express';
import {Observable} from 'rxjs';

import {User} from '../user';
import {AuthService} from './auth.service';

declare global {
  namespace Express {
    class Request {
      user: User;
    }

    interface SessionData {
      user?: {id: number};
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
    let session = request.session!;

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
