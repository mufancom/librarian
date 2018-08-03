import {IsEmail, Length} from 'class-validator';
import {LoginDto} from '../../auth/dto';

export class RegisterDto extends LoginDto {
  @Length(6, 50)
  @IsEmail()
  readonly email!: string;
}
