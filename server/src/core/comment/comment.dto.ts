import {IsDefined, IsNumber, Length} from 'class-validator';

export class PostDTO {
  @IsDefined()
  readonly filePath!: string;

  @IsNumber()
  readonly parentId: number = 0;

  @Length(1, 250)
  readonly content!: string;
}
