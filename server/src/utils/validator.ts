export class DataWrapper {
  [key: string]: any;

  constructor(data: any) {
    for (let key in data) {
      this[key] = data[key];
    }
  }
}

export function Wrap() {
  return (target: DataWrapper, propertyKey: string, parameterIndex: number) => {
    console.log('Wrap(): called', target);
  };
}
