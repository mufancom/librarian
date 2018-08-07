interface Constructor<T> {
  new (...args: any[]): T;
}

interface Dict<T> {
  [key: string]: T;
}
