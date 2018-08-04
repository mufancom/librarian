export interface Constructor<T> {
  new (...args: any[]): T;
}

export type ExcludeProperty<T extends object, K extends keyof T> = {
  [P in keyof T]: P extends K ? never : T[P]
};
