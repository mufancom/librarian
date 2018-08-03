import {IsEmail, Length} from 'class-validator';
import {LoginDto} from './login.dto';

export class RegisterDto extends LoginDto {
  @Length(6, 50)
  @IsEmail()
  readonly email!: string;
}
