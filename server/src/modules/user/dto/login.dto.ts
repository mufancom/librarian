import {Length} from 'class-validator';

export class LoginDto {
  @Length(4, 20)
  readonly username!: string;

  @Length(8, 48)
  readonly password!: string;
}
