import {Injectable} from '@nestjs/common';
import * as Path from 'path';
import {PUBLIC_DIR} from 'paths';
import * as File from 'utils/file';

const CONVENTION_MD_PATH = Path.join(PUBLIC_DIR, 'convention');

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
  async getIndex() {
    const files = await File.find(CONVENTION_MD_PATH, /.*\.md/, 2 + 1);
    return formIndex(files);
  }

  async exists(filePath: string) {
    const fullPath = Path.join(CONVENTION_MD_PATH, filePath);
    return File.exists(fullPath);
  }
}
