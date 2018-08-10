import {IsNumber, IsOptional, Length, MaxLength} from 'class-validator';

export class CreateDTO {
  @IsNumber()
  categoryId!: number;

  @IsOptional()
  @IsNumber()
  orderId?: number;

  @Length(1, 20)
  title!: string;

  @IsOptional()
  @MaxLength(40)
  alias?: string;
}

export class EditItemDTO {
  @IsNumber()
  conventionId!: number;

  @IsNumber()
  conventionItemId!: number;

  @IsNumber()
  fromId?: number;
}
