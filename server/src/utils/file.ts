import * as _FS from 'fs';
import * as Path from 'path';
import {promisify} from 'util';

export namespace FS {
  export const readdir = promisify(_FS.readdir);
  export const stat = promisify(_FS.stat);
  export const access = promisify(_FS.access);
}

export interface FileInfo {
  type: 'file';
}

export interface DirectoryInfo {
  type: 'directory';
  children: FileStructureInfo[];
}

export type FileStructureInfo = {
  path: string;
  relativePath: string;
  filename: string;
} & (FileInfo | DirectoryInfo);

export async function find(
  path: string | string[],
  pattern?: RegExp,
  depth?: number,
): Promise<FileStructureInfo[]> {
  if (depth === 0) {
    return [];
  } else if (typeof depth === 'undefined') {
    depth = -1;
  }

  if (typeof path === 'string') {
    path = [path];
  }

  const fullPath = Path.join(...path);
  const files = await FS.readdir(fullPath);

  let result: FileStructureInfo[] = [];

  for (const filename of files) {
    const filePath = Path.join(fullPath, filename);
    const stat = await FS.stat(filePath);
    const relativePath = Path.join(...path.slice(1));

    if (stat.isDirectory()) {
      result.push({
        path: fullPath,
        filename,
        relativePath,
        type: 'directory',
        children: await find([...path, filename], pattern, depth - 1),
      });
    } else if (!pattern || pattern.exec(filename)) {
      result.push({path: fullPath, relativePath, filename, type: 'file'});
    }
  }

  return result;
}

export async function exists(filePath: string) {
  try {
    await FS.access(filePath);
    return true;
  } catch (_error) {
    return false;
  }
}
