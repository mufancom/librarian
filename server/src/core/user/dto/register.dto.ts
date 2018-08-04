import {IsEmail, Length} from 'class-validator';
import {LoginDTO} from '../../auth';

export class RegisterDTO extends LoginDTO {
  @Length(6, 50)
  @IsEmail()
  readonly email!: string;
}
