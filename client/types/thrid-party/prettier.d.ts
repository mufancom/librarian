declare module 'prettier/standalone' {
  import {Options} from 'prettier';

  export function format(source: string, options?: Options): string;
}

declare module 'prettier/parser-babylon';

declare module 'prettier/parser-markdown';

declare module 'prettier/parser-typescript';

declare module 'prettier/parser-postcss';
