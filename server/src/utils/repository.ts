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
      leftObject[key.slice(leftKey.length + 1)] = value;
    } else if (key.startsWith(rightKey)) {
      rightObject[key.slice(rightKey.length + 1)] = value;
    }
  }

  return {
    left: leftObject,
    right: rightObject,
  };
}
