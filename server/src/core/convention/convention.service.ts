import {Injectable} from '@nestjs/common';
import * as Path from 'path';

import {CONVENTION_GIT_BASE_PATH} from 'paths';
import {Config} from 'utils/config';
import * as File from 'utils/file';
import {Git} from 'utils/git';

export interface IndexTree {
  title: string;
  url?: string;
  children?: IndexTree[];
}

function formIndex(fileTree: File.FileInfo[]) {
  let result: IndexTree[] = [];

  for (const fileInfo of fileTree) {
    if (fileInfo.type === 'directory') {
      result.push({
        title: fileInfo.filename,
        children: formIndex(fileInfo.children as File.FileInfo[]),
      });
    } else {
      const fileUrl = Path.join(fileInfo.relativePath, fileInfo.filename);

      result.push({
        title: fileInfo.filename.match(/([^\\/]+?)(?:\.\w+)$/)![1],
        url: fileUrl,
      });
    }
  }

  return result;
}

@Injectable()
export class ConventionService {
  private timer: NodeJS.Timer | undefined;
  private config = Config.Git;

  constructor() {
    if (this.config.get('sync', 'schedule') === 'schedule') {
      this.schedulePullTask();
    }
  }

  pullTask = async () => {
    await Git.pull(this.config.get('remote'), this.config.get('branch'));
  };

  schedulePullTask() {
    if (!this.timer) {
      this.timer = setInterval(
        this.pullTask,
        this.config.get('interval', 5) * 1000,
      );
    }
  }

  cancelPullTask() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = undefined;
    }
  }

  async getIndex() {
    const files = await File.find(CONVENTION_GIT_BASE_PATH, /.*\.md/, 2 + 1);
    return formIndex(files);
  }

  async exists(filePath: string) {
    const fullPath = Path.join(CONVENTION_GIT_BASE_PATH, filePath);
    return File.exists(fullPath);
  }

  async pull() {
    try {
      const result = await Git.pull();
    } catch (error) {}
  }
}
