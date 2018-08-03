import * as dotenv from 'dotenv';
import * as fs from 'fs';

export interface Config {
  [prop: string]: string;
}

export class ConfigService {
  private readonly envConfig: Config;

  constructor(filePath: string) {
    this.envConfig = dotenv.parse(fs.readFileSync(filePath));
  }

  get(): Config;
  get(key: string): string;
  get(key?: string): string | Config {
    if (key) {
      return this.envConfig[key];
    }
    return this.envConfig;
  }
}

const configBasePath = './config';

export class Config {
  static Database = new ConfigService(`${configBasePath}/database.env`);
  static Git = new ConfigService(`${configBasePath}/git.env`);
}
