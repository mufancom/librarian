import * as FS from 'fs';

import {TypeOrmModuleOptions} from '@nestjs/typeorm/dist/interfaces/typeorm-options.interface';
import {ExcludeProperty} from 'lang';
import {ConnectionOptions} from 'typeorm';

const hasOwnProperty = Object.prototype.hasOwnProperty;

export class ConfigService<T extends object> {
  private readonly data: T;

  constructor(filePath: string) {
    this.data = JSON.parse(FS.readFileSync(filePath).toLocaleString());
  }

  get(): T;
  get<K extends keyof T>(key: K): T[K] | undefined;
  get<K extends keyof T>(key: K, fallback: T[K]): T[K];
  get<K extends keyof T>(key?: K, fallback?: T[K]): T[K] | T | undefined {
    let data = this.data;

    if (key) {
      if (hasOwnProperty.call(data, key)) {
        return data[key];
      }

      return fallback;
    }

    return data;
  }
}

const configBasePath = './config';

export type DatabaseConfig = ExcludeProperty<
  TypeOrmModuleOptions & Partial<ConnectionOptions>,
  'entities'
>;

export interface GitConfig {}

export class Config {
  static Database = new ConfigService<DatabaseConfig>(
    `${configBasePath}/database.json`,
  );
  static Git = new ConfigService(`${configBasePath}/git.json`);
  static Session = new ConfigService(`${configBasePath}/session.json`);
}
