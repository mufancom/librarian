import 'reflect-metadata';

import {validate as _validate} from 'class-validator';

import {ValidationFailedException} from 'common/exceptions';
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
  for (const key in error.constraints) {
    return error.constraints[key];
  }

  return 'Unknown';
}

export function Validate() {
  return (
    target: any,
    propertyName: string,
    descriptor: TypedPropertyDescriptor<any>,
  ) => {
    let method = descriptor.value as Function;

    descriptor.value = async function() {
      let _arguments = arguments;
      let wrappedParameters: WrapParameterMetaData[] = Reflect.getOwnMetadata(
        wrapMetadataKey,
        target,
        propertyName,
      );

      if (wrappedParameters) {
        for (const [index] of wrappedParameters.entries()) {
          const dataWrapper = new wrappedParameters[
            index
          ].dataWrapperConstructor();

          for (const key in _arguments[index]) {
            dataWrapper[key] = _arguments[index][key];
          }

          await _validate(dataWrapper).then(errors => {
            if (errors.length > 0) {
              throw new ValidationFailedException(describeError(errors[0]));
            }
          });

          _arguments[index] = dataWrapper;
        }
      }

      return method.apply(this, _arguments);
    };
  };
}
