import * as FS from 'fs';
import * as Path from 'path';

import {TypeOrmModuleOptions} from '@nestjs/typeorm/dist/interfaces/typeorm-options.interface';
import {ConnectionOptions} from 'typeorm';

import {ExcludeProperty} from 'lang';
import {PROJECT_DIR} from 'paths';

const hasOwnProperty = Object.prototype.hasOwnProperty;

const CONFIG_BASE_PATH = Path.join(PROJECT_DIR, '.config');
const SERVER_CONFIG_PATH = Path.join(CONFIG_BASE_PATH, 'server.json');
const DATABASE_CONFIG_PATH = Path.join(CONFIG_BASE_PATH, 'database.json');
const SESSION_CONFIG_PATH = Path.join(CONFIG_BASE_PATH, 'session.json');

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

export interface ServerConfig {
  port: number;
  enableCors: boolean;
  corsOrigin: string;
}

export type DatabaseConfig = ExcludeProperty<
  TypeOrmModuleOptions & Partial<ConnectionOptions>,
  'entities'
>;

export interface SessionConfig {
  secret: string;
}

export class Config {
  static server = new ConfigService<ServerConfig>(SERVER_CONFIG_PATH);
  static database = new ConfigService<DatabaseConfig>(DATABASE_CONFIG_PATH);
  static session = new ConfigService<SessionConfig>(SESSION_CONFIG_PATH);
}
