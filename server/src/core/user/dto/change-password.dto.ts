import {Length} from 'class-validator';

export class ChangePasswordDTO {
  @Length(8, 48)
  readonly oldPassword!: string;

  @Length(8, 48)
  readonly newPassword!: string;
}
