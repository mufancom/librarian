import highlight from 'highlight.js';
import marked, {MarkedOptions, Renderer} from 'marked';
import {CursorOptions, CursorResult, Options} from 'prettier';
import prettierBabylonParser from 'prettier/parser-babylon';
import prettierMarkdownParser from 'prettier/parser-markdown';
import prettierPostCSS from 'prettier/parser-postcss';
import prettierTypescriptParser from 'prettier/parser-typescript';
import prettier from 'prettier/standalone';

import {filterHTMLTags} from './regex';

const prettierPlugins = [
  prettierMarkdownParser,
  prettierTypescriptParser,
  prettierPostCSS,
  prettierBabylonParser,
];

highlight.configure({
  tabReplace: '  ',
  classPrefix: 'hljs-',
  languages: [
    'CSS',
    'HTML, XML',
    'JavaScript',
    'PHP',
    'Python',
    'Stylus',
    'TypeScript',
    'Markdown',
  ],
});

class HeadingRenderer extends Renderer {
  constructor(
    private _heading: (text: string, level: number) => void,
    options?: MarkedOptions,
  ) {
    super(options);
  }

  heading(text: string, level: number): string {
    this._heading(text, level);
    return `<h${level} id="${encodeURI(text)}">${text}</h${level}>\n`;
  }
}

const defaultMarkOptions = {
  highlight: (code: string): string => {
    return highlight.highlightAuto(code).value;
  },
};

export interface PlainHeading {
  text: string;
  level: number;
}

export interface Heading extends PlainHeading {
  id: string;
  parent?: Heading | undefined;
  children: Heading[];
}

interface MarkdownRenderResult {
  html: string;
  headingTree: Heading[];
}

export function mark(
  markdown: string,
  decycle: boolean = true,
): MarkdownRenderResult {
  let plainHeadings: PlainHeading[] = [];

  let headerRendingHook = (text: string, level: number): void => {
    text = filterHTMLTags(text);
    plainHeadings.push({text, level});
  };

  let markOptions = {
    ...defaultMarkOptions,
    renderer: new HeadingRenderer(headerRendingHook),
  };

  let html = marked(markdown, markOptions);

  let headingTree = buildHeadingTree(plainHeadings);

  if (decycle) {
    headingTree = decycleHeadingTree(headingTree);
  }

  return {html, headingTree};
}

function buildHeadingTree(headings: PlainHeading[]): Heading[] {
  let headingTree: Heading[] = [];

  let lastHeading: Heading | undefined;

  for (let {level, text} of headings) {
    let heading: Heading = {
      text,
      level,
      id: encodeURI(text),
      children: [],
    };

    let treeToHookOn = headingTree;

    if (lastHeading) {
      if (level > lastHeading.level) {
        heading.parent = lastHeading;
        treeToHookOn = lastHeading.children;
      } else {
        let parentHeading = lastHeading.parent;

        while (parentHeading && level <= parentHeading.level) {
          parentHeading = parentHeading.parent;
        }

        if (parentHeading) {
          heading.parent = parentHeading;
          treeToHookOn = parentHeading.children;
        }
      }
    }

    treeToHookOn.push(heading);
    lastHeading = heading;
  }

  return headingTree;
}

export function decycleHeadingTree(headingTree: Heading[]): Heading[] {
  for (let heading of headingTree) {
    heading.parent = undefined;

    if (heading.children) {
      heading.children = decycleHeadingTree(heading.children);
    }
  }

  return headingTree;
}

const prettifyDefaultOptions = {
  parser: 'markdown' as 'markdown',
  plugins: prettierPlugins as any,
};

export function prettify(markdown: string, options?: Options): string {
  return prettier.format(markdown, {...prettifyDefaultOptions, ...options});
}

export function prettifyWithCursor(
  markdown: string,
  cursorOffset: number,
  options?: CursorOptions,
): CursorResult {
  return prettier.formatWithCursor(markdown, {
    ...prettifyDefaultOptions,
    cursorOffset,
    ...options,
  });
}
