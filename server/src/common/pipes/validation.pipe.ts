import {ArgumentMetadata, Injectable, PipeTransform} from '@nestjs/common';
import {plainToClass} from 'class-transformer';
import {validate} from 'class-validator';
import hyphenate from 'hyphenate';

import {ValidationException} from '../exceptions';

const TYPES_NOT_TO_VALIDATE = [String, Boolean, Number, Array, Object];

function getErrorConstraintName(error: any): string {
  for (let key in error.constraints) {
    return key.toUpperCase();
  }

  return 'UNKNOWN';
}

@Injectable()
export class ValidationPipe implements PipeTransform {
  async transform(value: object, metadata: ArgumentMetadata) {
    let {metatype} = metadata;

    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }

    let object = plainToClass(metatype, value);

    let errors = await validate(object, {
      forbidUnknownValues: true,
      whitelist: true,
    });

    if (errors.length > 0) {
      let propertyName = hyphenate(errors[0].property, {
        connector: '_',
      }).toUpperCase();

      throw new ValidationException(
        `${propertyName}_${getErrorConstraintName(errors[0])}_EXCEPTION`,
      );
    }

    return object;
  }

  private toValidate(metatype: any): boolean {
    return !TYPES_NOT_TO_VALIDATE.some(type => metatype === type);
  }
}
