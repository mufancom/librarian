import {IsNumber, IsOptional, Length, Min} from 'class-validator';

export class CreateDTO {
  @IsNumber()
  readonly parentId!: number;

  @IsOptional()
  @IsNumber()
  @Min(-1)
  readonly afterOrderId?: number;

  @Length(1, 20)
  readonly title!: string;

  @IsOptional()
  @Length(1, 20)
  readonly alias?: string;
}

export class EditDTO {
  @IsNumber()
  readonly id!: number;

  @IsOptional()
  @IsNumber()
  @Min(-1)
  readonly afterOrderId?: number;

  @IsOptional()
  @Length(1, 20)
  readonly title?: string;

  @IsOptional()
  @Length(1, 20)
  readonly alias?: string;
}
