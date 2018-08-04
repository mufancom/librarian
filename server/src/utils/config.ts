import * as fs from 'fs';

export interface Config {
  [prop: string]: string;
}

export class ConfigService {
  private readonly envConfig: Config;

  constructor(filePath: string) {
    this.envConfig = JSON.parse(fs.readFileSync(filePath).toLocaleString());
  }

  get(): Config;
  get(key: string, fallback?: string): string;
  get(key?: string, fallback?: string): string | Config {
    if (key) {
      if (typeof this.envConfig[key] === 'undefined' && fallback) {
        return fallback;
      }
      return this.envConfig[key];
    }
    return this.envConfig;
  }
}

const configBasePath = './config';

export class Config {
  static Database = new ConfigService(`${configBasePath}/database.json`);
  static Git = new ConfigService(`${configBasePath}/git.json`);
  static Session = new ConfigService(`${configBasePath}/session.json`);
}
