import * as FS from 'fs';
import * as Path from 'path';

import {TypeOrmModuleOptions} from '@nestjs/typeorm/dist/interfaces/typeorm-options.interface';
import {ExcludeProperty} from 'lang';
import {PROJECT_DIR} from 'paths';
import {ConnectionOptions} from 'typeorm';

const hasOwnProperty = Object.prototype.hasOwnProperty;

const CONFIG_BASE_PATH = Path.join(PROJECT_DIR, '.config');
const DATABASE_CONFIG_PATH = Path.join(CONFIG_BASE_PATH, 'database.json');
const GIT_CONFIG_PATH = Path.join(CONFIG_BASE_PATH, 'git.json');
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

export type DatabaseConfig = ExcludeProperty<
  TypeOrmModuleOptions & Partial<ConnectionOptions>,
  'entities'
>;

export interface CommonGitConfig {
  remote: string;
  branch: string;
}

export interface ScheduleSyncGitConfig {
  sync: 'schedule';
  interval: number;
}

export type GitConfig = ScheduleSyncGitConfig & CommonGitConfig;

export interface SessionConfig {
  secret: string;
}

export class Config {
  static database = new ConfigService<DatabaseConfig>(DATABASE_CONFIG_PATH);
  static git = new ConfigService<GitConfig>(GIT_CONFIG_PATH);
  static session = new ConfigService<SessionConfig>(SESSION_CONFIG_PATH);
}
