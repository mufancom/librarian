import {IsEmail, Length} from 'class-validator';

export class ChangePasswordDTO {
  @Length(8, 48)
  readonly oldPassword!: string;

  @Length(8, 48)
  readonly newPassword!: string;
}

export class RegisterDTO {
  @Length(6, 50)
  @IsEmail()
  readonly email!: string;

  @Length(4, 20)
  readonly username!: string;

  @Length(8, 48)
  readonly password!: string;
}
