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

function buildIndex(fileTree: File.FileInfo[]): IndexTree[] {
  let result: IndexTree[] = [];

  for (let {type, filename, relativePath, children} of fileTree) {
    if (type === 'directory') {
      if (!filename.startsWith('.')) {
        result.push({
          title: filename,
          children: buildIndex(children as File.FileInfo[]),
        });
      }
    } else {
      let path = Path.join(relativePath, filename);

      result.push({
        title: filename.match(/([^\\/]+?)(?:\.\w+)$/)![1],
        path,
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
    let infos = await File.find(CONVENTION_GIT_BASE_PATH, /.*\.md/, 2 + 1);
    return buildIndex(infos);
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
