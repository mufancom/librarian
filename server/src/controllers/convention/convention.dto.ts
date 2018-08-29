import {IsNumber, IsOptional, Length, Matches, Min} from 'class-validator';

import {REGEX_TITLE} from 'utils/regex';

export class CreateDTO {
  @IsNumber()
  readonly categoryId!: number;

  @IsOptional()
  @IsNumber()
  @Min(-1)
  readonly afterOrderId?: number;

  @Length(1, 20)
  @Matches(REGEX_TITLE)
  readonly title!: string;

  @IsOptional()
  @Length(1, 20)
  @Matches(REGEX_TITLE)
  readonly alias?: string;
}

export class EditDTO {
  @IsNumber()
  id!: number;

  @IsOptional()
  @IsNumber()
  @Min(-1)
  readonly afterOrderId?: number;

  @IsOptional()
  @Length(1, 20)
  @Matches(REGEX_TITLE)
  readonly title?: string;

  @IsOptional()
  @Length(1, 20)
  @Matches(REGEX_TITLE)
  readonly alias?: string;
}
