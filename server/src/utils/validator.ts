import 'reflect-metadata';

import {ValidatorOptions, validate} from 'class-validator';

import {ValidationException} from 'common/exceptions';
import {Constructor} from 'lang';

const wrapMetadataKey = Symbol('Wrap');

interface WrapParameterMetaData {
  parameterIndex: number;
  dataWrapperConstructor: Constructor<any>;
}

export function Wrap(withType: Constructor<any>) {
  return (target: object, propertyKey: string, parameterIndex: number) => {
    let existingRequiredParameters: WrapParameterMetaData[] =
      Reflect.getOwnMetadata(wrapMetadataKey, target, propertyKey) || [];

    existingRequiredParameters.push({
      parameterIndex,
      dataWrapperConstructor: withType,
    });

    Reflect.defineMetadata(
      wrapMetadataKey,
      existingRequiredParameters,
      target,
      propertyKey,
    );
  };
}

function describeError(error: any): string {
  for (let key in error.constraints) {
    return key.toUpperCase();
  }

  return 'UNKNOWN';
}

export function Validate(
  options: ValidatorOptions = {forbidUnknownValues: true, whitelist: true},
) {
  return (
    target: any,
    propertyName: string,
    descriptor: TypedPropertyDescriptor<Function>,
  ) => {
    let method = descriptor.value!;

    descriptor.value = async function(...args: any[]) {
      let wrappedParameters: WrapParameterMetaData[] = Reflect.getOwnMetadata(
        wrapMetadataKey,
        target,
        propertyName,
      );

      if (wrappedParameters) {
        for (let index of wrappedParameters.keys()) {
          let constructor = wrappedParameters[index].dataWrapperConstructor;

          let dataWrapper = new constructor();

          for (let key in args[index]) {
            dataWrapper[key] = args[index][key];
          }

          let errors = await validate(dataWrapper, options);

          if (errors.length > 0) {
            let propertyName = errors[0].property
              .replace(/([A-Z])/g, '-$1')
              .toUpperCase();

            throw new ValidationException(
              `${propertyName}_${describeError(errors[0])}_EXCEPTION`,
            );
          }

          args[index] = dataWrapper;
        }
      }

      return method.apply(this, args);
    };
  };
}
