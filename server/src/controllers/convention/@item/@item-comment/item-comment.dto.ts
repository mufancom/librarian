import {IsNumber, IsOptional, Length} from 'class-validator';

export class PostDTO {
  @IsNumber()
  readonly itemVersionId!: number;

  @IsOptional()
  @IsNumber()
  readonly parentId?: number;

  @Length(1, 250)
  readonly content!: string;
}

export class EditDTO {
  @IsNumber()
  readonly id!: number;

  @Length(1, 250)
  readonly content!: string;
}
