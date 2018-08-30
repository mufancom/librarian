import {underscoreToCamelCase} from './regex';

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

export function isOutDated(date: Date): boolean {
  let now = Date.now();

  return now < date.getTime();
}

/**
 * @param period number seconds
 */
export function describeAPeriodOfTime(period: number): string {
  if (period < 60) {
    return `${period} 秒`;
  } else if (period < 3600) {
    return `${period / 60} 分钟`;
  }

  return `${period / 3600} 小时`;
}
