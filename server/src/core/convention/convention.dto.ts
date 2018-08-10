import {IsNumber, IsOptional, Length, Max, MaxLength} from 'class-validator';

export class CreateDTO {
  @IsNumber()
  categoryId!: number;

  @IsOptional()
  @IsNumber()
  afterOrderId?: number;

  @Length(1, 20)
  title!: string;

  @IsOptional()
  @MaxLength(40)
  alias?: string;
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
