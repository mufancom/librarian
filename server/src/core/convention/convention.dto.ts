import {IsNumber, IsOptional, Length, Max, MaxLength} from 'class-validator';

export class CreateDTO {
  @IsNumber()
  readonly categoryId!: number;

  @IsOptional()
  @IsNumber()
  @Max(-1)
  readonly afterOrderId?: number;

  @Length(1, 20)
  readonly title!: string;

  @IsOptional()
  @MaxLength(40)
  readonly alias?: string;
}

export class EditDTO {
  @IsNumber()
  id!: number;

  @IsOptional()
  @IsNumber()
  @Max(-1)
  readonly afterOrderId?: number;

  @IsOptional()
  @Length(1, 20)
  readonly title?: string;

  @IsOptional()
  @Length(1, 20)
  readonly alias?: string;
}
