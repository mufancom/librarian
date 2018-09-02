import * as Process from 'child_process';
import * as FS from 'fs';
import * as Path from 'path';
import {promisify} from 'util';

import rimraf from 'rimraf';

export const PROJECT_DIR = Path.join(__dirname, '..');
export const SHARED_PROJECT_DIR = Path.join(PROJECT_DIR, 'shared');
export const SERVER_PROJECT_DIR = Path.join(PROJECT_DIR, 'server');
export const CLIENT_PROJECT_DIR = Path.join(PROJECT_DIR, 'client');

export interface ExecStdOut {
  stdout: string;
  stderr: string;
}

export function exec(command: string, cwd?: string): Promise<ExecStdOut> {
  return new Promise<ExecStdOut>((resolve, reject) => {
    Process.exec(command, {cwd}, (error, stdout, stderr) => {
      if (error) {
        reject(error);
      }

      resolve({stdout, stderr});
    });
  });
}

export function joinPath(...paths: string[]): string {
  return Path.join(...paths);
}

export function readFile(path: string): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    FS.readFile(path, (error, buffer) => {
      if (error) {
        reject(error);
      }

      resolve(buffer.toLocaleString());
    });
  });
}

export const writeFile = promisify(FS.writeFile);

export const deleteFile = promisify(rimraf);

export const renameFile = promisify(FS.rename);

export async function parseConfig<T>(filePath: string): Promise<T> {
  let file = await readFile(filePath);

  let configs = JSON.parse(file);

  return configs as T;
}

export async function replaceFileContent(
  filePath: string,
  substr: RegExp | string,
  replacement: string,
): Promise<() => Promise<void>> {
  let source = await readFile(filePath);

  let doctored = source.replace(substr, replacement);

  await writeFile(filePath, doctored);

  return async () => {
    await writeFile(filePath, source);
  };
}
