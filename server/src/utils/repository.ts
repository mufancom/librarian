import {underscoreToCamelCase} from 'utils/regex';

export interface SeparatedJoinedResult<L, R> {
  left: L;
  right: R;
}

export function splitJoinedResult<L, R>(
  leftKey: string,
  rightKey: string,
  mixedData: object,
): SeparatedJoinedResult<L, R> {
  let leftObject: any = {};
  let rightObject: any = {};

  for (const [key, value] of Object.entries(mixedData)) {
    if (key.startsWith(leftKey)) {
      let fieldName = underscoreToCamelCase(key.slice(leftKey.length + 1));

      leftObject[fieldName] = value;
    } else if (key.startsWith(rightKey)) {
      let fieldName = underscoreToCamelCase(key.slice(rightKey.length + 1));

      rightObject[fieldName] = value;
    }
  }

  return {
    left: leftObject,
    right: rightObject,
  };
}
