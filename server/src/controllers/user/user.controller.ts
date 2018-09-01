import url from 'url';

import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import {Request} from 'express';

import {
  AuthenticationFailedException,
  ResourceConflictingException,
  ResourceNotFoundException,
} from '../../common/exceptions';
import {AuthGuard} from '../../core/auth';
import {
  RegisterInvitation,
  RegisterInvitationGuard,
  RegisterInvitationStatus,
  UserService,
} from '../../core/user';
import {Config} from '../../utils/config';
import {comparePassword, encryptPassword} from '../../utils/encryption';
import {renderMailTemplate, sendMail} from '../../utils/mail';
import {describeAPeriodOfTime} from '../../utils/repository';

import {
  ChangePasswordDTO,
  GenerateInvitationDTO,
  RegisterDTO,
  RegisterWithInvitationDTO,
} from './user.dto';

@Controller('user')
export class UserController {
  constructor(@Inject(UserService) private userService: UserService) {}

  @Post('register')
  async register(@Body() data: RegisterDTO) {
    let registerConfig = Config.user.get('register');

    if (
      registerConfig &&
      (!registerConfig.enable || registerConfig.method !== 'open')
    ) {
      throw new AuthenticationFailedException('REGISTER_NOT_OPEN');
    }

    if (await this.userService.findByIdentifier(data.username, 'username')) {
      throw new ResourceConflictingException('USERNAME_ALREADY_EXISTS');
    }

    if (await this.userService.findByIdentifier(data.email, 'email')) {
      throw new ResourceConflictingException('EMAIL_ALREADY_EXISTS');
    }

    await this.userService.create({
      ...data,
      password: await encryptPassword(data.password),
    });
  }

  @Post('change-password')
  @UseGuards(AuthGuard)
  async changePassword(
    @Body() data: ChangePasswordDTO,
    @Req() {user}: Request,
  ): Promise<void> {
    if (!(await comparePassword(data.oldPassword, user.password))) {
      throw new AuthenticationFailedException('USERNAME_PASSWORD_MISMATCH');
    }

    user.password = await encryptPassword(data.newPassword);

    await this.userService.save(user);
  }

  @Get('info')
  async info(@Query('id') id: number) {
    let user = await this.userService.findByIdentifier(id, 'id');

    if (!user) {
      throw new ResourceNotFoundException('USER_NOT_FOUND');
    }

    let {username, email} = user;

    return {id, username, email};
  }

  @Post('generate-invitation')
  @UseGuards(AuthGuard)
  async generateInvitation(
    @Body() data: GenerateInvitationDTO,
    @Req() {user}: Request,
  ) {
    let registerConfig = Config.user.get('register');

    if (
      !registerConfig ||
      !registerConfig.enable ||
      registerConfig.method !== 'invitation'
    ) {
      throw new AuthenticationFailedException(
        'REGISTER_INVITATION_NOT_AVAILABLE',
      );
    }

    if (await this.userService.findByIdentifier(data.email, 'email')) {
      throw new ResourceConflictingException('EMAIL_ALREADY_EXISTS');
    }

    let lifespan = registerConfig.invitationLifespan
      ? registerConfig.invitationLifespan
      : 36000;

    let invitation = await this.userService.createRegisterInvitation(
      user.id,
      data.email,
      lifespan,
    );

    let inviter = user.username;

    let website = Config.server.get('clientURL', 'http://localhost: 3000');

    let link = url.resolve(
      website,
      `/user/register-invitation?code=${invitation.linkHash}`,
    );

    let expiredAt = describeAPeriodOfTime(lifespan);

    let mailContent = await renderMailTemplate('register-invitation', {
      inviter,
      link,
      expiredAt,
    });

    let mailGlobalVariable = Config.mail.get('global') as any;

    let websiteName = 'librarian';

    if (mailGlobalVariable && 'websiteName' in mailGlobalVariable) {
      websiteName = mailGlobalVariable['websiteName'];
    }

    await sendMail({
      to: invitation.email,
      subject: `${inviter} 邀请您加入 ${websiteName}`,
      html: mailContent,
    });

    return invitation;
  }

  @Get('decline-invitation')
  async declineInvitation(@Query('hash') linkHash: string) {
    let invitation = await this.userService.findRegisterInvitationByHash(
      linkHash,
    );

    if (!invitation || invitation.status !== RegisterInvitationStatus.pending) {
      throw new ResourceNotFoundException('REGISTER_INVITATION_NOT_FOUND');
    }

    invitation.status = RegisterInvitationStatus.declined;

    await this.userService.saveRegisterInvitation(invitation);
  }

  @Get('grant-register')
  async grantRegistration(
    @Query('hash') linkHash: string,
    @Req() req: Request,
  ) {
    let invitation = (await this.userService.findRegisterInvitationByHash(
      linkHash,
    )) as RegisterInvitation;

    await this.userService.validateRegisterInvitation(
      invitation,
      RegisterInvitationStatus.pending,
    );

    let session = req.session!;

    session.registerInvitation = {id: invitation.id};

    invitation.status = RegisterInvitationStatus.granted;

    return this.userService.saveRegisterInvitation(invitation);
  }

  @Post('register-with-invitation')
  @UseGuards(RegisterInvitationGuard)
  async registerWithInvitation(
    @Body() data: RegisterWithInvitationDTO,
    @Req() {registerInvitation}: Request,
  ) {
    let registerConfig = Config.user.get('register');

    if (
      !registerConfig ||
      !registerConfig.enable ||
      registerConfig.method !== 'invitation'
    ) {
      throw new AuthenticationFailedException(
        'REGISTER_INVITATION_NOT_AVAILABLE',
      );
    }

    if (await this.userService.findByIdentifier(data.username, 'username')) {
      throw new ResourceConflictingException('USERNAME_ALREADY_EXISTS');
    }

    if (
      await this.userService.findByIdentifier(registerInvitation.email, 'email')
    ) {
      throw new ResourceConflictingException('EMAIL_ALREADY_EXISTS');
    }

    await this.userService.create({
      ...data,
      email: registerInvitation.email,
      password: await encryptPassword(data.password),
    });

    registerInvitation.status = RegisterInvitationStatus.accepted;

    await this.userService.saveRegisterInvitation(registerInvitation);
  }
}
