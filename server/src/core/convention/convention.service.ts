import * as Path from 'path';

import {Injectable} from '@nestjs/common';

import {CONVENTION_GIT_BASE_PATH} from 'paths';
import {Config} from 'utils/config';
import * as File from 'utils/file';
import {Git} from 'utils/git';

export interface IndexTree {
  title: string;
  path?: string;
  children?: IndexTree[];
}

export interface IndexJSON {
  [key: string]: string | IndexJSON;
}

function buildIndexFromFileInfos(
  fileTree: File.FileStructureInfo[],
): IndexTree[] {
  let result: IndexTree[] = [];

  for (let fileInfo of fileTree) {
    let {filename, relativePath} = fileInfo;

    if (fileInfo.type === 'directory') {
      let {children} = fileInfo;

      if (!filename.startsWith('.')) {
        result.push({
          title: filename,
          children: buildIndexFromFileInfos(children),
        });
      }
    } else {
      let path = Path.join(relativePath, filename).replace(/\\/g, '/');

      result.push({
        title: filename.match(/([^\\/]+?)(?:\.\w+)$/)![1],
        path,
      });
    }
  }

  return result;
}

function buildIndexFromJSON(index: IndexJSON): IndexTree[] {
  let result: IndexTree[] = [];
  for (let [key, value] of Object.entries(index)) {
    if (typeof value === 'string') {
      result.push({
        title: key,
        path: value,
      });
    } else {
      result.push({
        title: key,
        children: buildIndexFromJSON(value),
      });
    }
  }
  return result;
}

@Injectable()
export class ConventionService {
  private timer: NodeJS.Timer | undefined;
  private config = Config.git;

  constructor() {
    if (this.config.get('sync', 'schedule') === 'schedule') {
      this.schedulePullTask();
    }
  }

  pullTask = async () => {
    await Git.pull(this.config.get('remote'), this.config.get('branch'));
  };

  schedulePullTask() {
    if (this.timer) {
      return;
    }

    this.timer = setInterval(
      this.pullTask,
      this.config.get('interval', 5) * 1000,
    );
  }

  cancelPullTask() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = undefined;
    }
  }

  async getIndex() {
    let indexPath = Path.join(CONVENTION_GIT_BASE_PATH, 'index.json');

    if (await File.exists(indexPath)) {
      try {
        let index = JSON.parse(await File.read(indexPath));

        return buildIndexFromJSON(index);
      } catch (_error) {}
    }

    let infos = await File.find(CONVENTION_GIT_BASE_PATH, /.*\.md/, 2 + 1);
    return buildIndexFromFileInfos(infos);
  }

  async exists(filePath: string) {
    let fullPath = Path.join(CONVENTION_GIT_BASE_PATH, filePath);
    return File.exists(fullPath);
  }

  async pull() {
    try {
      let result = await Git.pull();
    } catch (error) {}
  }
}
