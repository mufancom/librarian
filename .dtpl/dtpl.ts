import * as FS from 'fs';
import * as Path from 'path';

import {IDtplConfig, IInject, IUserTemplate, Source} from 'dot-template-types';

export default function(source: Source): IDtplConfig {
  const fileName = Path.basename(source.filePath);
  const basename = source.filePath.match(/([^\\/]+?)(?:\.\w+){0,2}$/)![1];
  const url = basename.replace(/^@/, '').replace(/\./, '-');

  const localData = {
    htmlClassName: basename.replace(/^@/, ''),
    defaultUrl: url,
  };

  injectIndexExports();

  const templates: IUserTemplate[] = [
    {
      name: 'templates/module',
      matches: '*/src/**',
    },
    {
      name: 'templates/react/component.tsx.dtpl',
      matches: 'client/src/components/**/*.tsx',
    },
    {
      name: 'templates/react/component-module',
      matches: 'client/src/components/**',
    },
    {
      name: 'templates/nest/module.ts.dtpl',
      matches: 'server/src/**/*.module.ts',
    },
    {
      name: 'templates/nest/controller.ts.dtpl',
      matches: 'server/src/**/*.controller.ts',
    },
    {
      name: 'templates/nest/service.ts.dtpl',
      matches: 'server/src/**/*.service.ts',
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

    const indexPath = Path.join(source.filePath, '../index.ts');

    if (FS.existsSync(indexPath)) {
      const fileNameWithoutExt = fileName.replace(/\.[^.]+$/, '');
      FS.appendFileSync(
        indexPath,
        `export * from './${fileNameWithoutExt}';\n`,
      );
    }
  }
}
