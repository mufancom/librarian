import {IsEmail, Length} from 'class-validator';

import {LoginDTO} from '../auth';

export class ChangePasswordDTO {
  @Length(8, 48)
  readonly oldPassword!: string;

  @Length(8, 48)
  readonly newPassword!: string;
}

export class RegisterDTO extends LoginDTO {
  @Length(6, 50)
  @IsEmail()
  readonly email!: string;
}
