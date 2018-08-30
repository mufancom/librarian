import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common';
import {Request} from 'express';
import {Observable} from 'rxjs';

import {
  RegisterInvitation,
  RegisterInvitationStatus,
} from './register-invitation.entity';
import {UserService} from './user.service';

declare global {
  namespace Express {
    interface Request {
      registerInvitation: RegisterInvitation;
    }

    interface SessionData {
      registerInvitation?: {id: number};
    }
  }
}

@Injectable()
export class RegisterInvitationGuard implements CanActivate {
  constructor(@Inject(UserService) private readonly userService: UserService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    return this.validateRequest(request);
  }

  async validateRequest(request: Request): Promise<boolean> {
    let session = request.session!;

    if (session.registerInvitation && session.registerInvitation.id) {
      let {id} = session.registerInvitation;

      let invitation = await this.userService.findRegisterInvitationById(id);

      if (invitation) {
        request.registerInvitation = invitation;

        await this.userService.validateRegisterInvitation(
          invitation,
          RegisterInvitationStatus.granted,
        );

        return true;
      }
    }

    session.registerInvitation = undefined;

    return false;
  }
}
