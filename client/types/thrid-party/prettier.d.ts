declare module 'prettier/standalone' {
  import {CursorOptions, CursorResult, Options} from 'prettier';

  export function format(source: string, options?: Options): string;

  export function formatWithCursor(
    source: string,
    options: CursorOptions,
  ): CursorResult;
}

declare module 'prettier/parser-babylon';

declare module 'prettier/parser-markdown';

declare module 'prettier/parser-typescript';

declare module 'prettier/parser-postcss';
