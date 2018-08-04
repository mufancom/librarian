import * as FS from 'fs';
import * as Path from 'path';

import {IDtplConfig, IInject, IUserTemplate, Source} from 'dot-template-types';

export default function(source: Source): IDtplConfig {
  let fileName = Path.basename(source.filePath);
  let basename = source.filePath.match(/([^\\/]+?)(?:\.\w+)?$/)![1];

  let localData = {
    htmlClassName: basename.replace(/^@/, ''),
  };

  injectIndexExports();

  let templates: IUserTemplate[] = [
    {
      name: 'templates/component.tsx.dtpl',
      matches: 'client/src/components/**/*.tsx',
    },
    {
      name: 'templates/component-module',
      matches: 'client/src/components/**',
    },
    {
      name: 'templates/module',
      matches: '*/src/**',
    },
  ].map(template => {
    return {localData, ...template};
  });

  return {templates};

  function injectIndexExports(): void {
    if (
      fileName.startsWith('@') ||
      (source.isFile && !/\.tsx?/.test(fileName))
    ) {
      return;
    }

    let indexPath = Path.join(source.filePath, '../index.ts');

    if (FS.existsSync(indexPath)) {
      let fileNameWithoutExt = fileName.replace(/\.[^.]+$/, '');
      FS.appendFileSync(
        indexPath,
        `export * from './${fileNameWithoutExt}';\n`,
      );
    }
  }
}
