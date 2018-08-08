import {ArgumentMetadata, Injectable, PipeTransform} from '@nestjs/common';
import {plainToClass} from 'class-transformer';
import {validate} from 'class-validator';

import {ValidationFailedException} from '../exceptions';

function describeError(error: any): string {
  for (const key in error.constraints) {
    return key.toUpperCase();
  }
  return 'UNKNOWN';
}

@Injectable()
export class ValidationPipe implements PipeTransform {
  async transform(value: object, metadata: ArgumentMetadata) {
    const {metatype} = metadata;

    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }

    const object = plainToClass(metatype, value);

    const errors = await validate(object, {
      forbidUnknownValues: true,
      whitelist: true,
    });

    if (errors.length > 0) {
      const propertyName = errors[0].property
        .replace(/([A-Z])/g, '_$1')
        .toUpperCase();

      throw new ValidationFailedException(
        `${propertyName}_${describeError(errors[0])}_EXCEPTION`,
      );
    }

    return object;
  }

  private toValidate(metatype: any): boolean {
    const types = [String, Boolean, Number, Array, Object];
    return !types.find(type => metatype === type);
  }
}
