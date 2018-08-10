import {IsNumber, IsOptional, Min, MinLength} from 'class-validator';

export class CreateDTO {
  @IsNumber()
  readonly conventionId!: number;

  @IsOptional()
  @IsNumber()
  @Min(-1)
  readonly afterOrderId?: number;

  @MinLength(1)
  readonly content!: string;

  @IsOptional()
  @IsNumber()
  versionId?: number;
}

export class EditDTO {
  @IsNumber()
  readonly id!: number;

  @IsNumber()
  readonly fromVersionId!: number;

  @MinLength(1)
  readonly content!: string;
}

export class ShiftDTO {
  @IsNumber()
  readonly id!: number;

  @IsNumber()
  @Min(-1)
  readonly afterOrderId!: number;
}

export class RollbackDTO {
  @IsNumber()
  readonly toVersionId!: number;
}
