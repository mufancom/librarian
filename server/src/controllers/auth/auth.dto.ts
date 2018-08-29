import {Length} from 'class-validator';

export class LoginDTO {
  @Length(4, 20)
  readonly username!: string;

  @Length(8, 48)
  readonly password!: string;
}
