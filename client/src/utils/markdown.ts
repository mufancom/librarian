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
    private _heading: (text: string, level: number) => string,
    options?: MarkedOptions,
  ) {
    super(options);
  }

  heading(text: string, level: number): string {
    let id = this._heading(text, level);
    return `<h${level} id="${encodeURI(
      `${id} ${text}`,
    )}">${text}</h${level}>\n`;
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
  id: string;
}

export interface Heading extends PlainHeading {
  parent?: Heading | undefined;
  children: Heading[];
}

interface MarkdownRenderResult {
  html: string;
  headingTree: Heading[];
}

function feedDotWhenNone(id: string): string {
  if (id.indexOf('.') === -1) {
    return `${id}.`;
  }

  return id;
}

export function mark(
  markdown: string,
  decycle: boolean = true,
  startFromId: number = 1,
): MarkdownRenderResult {
  let plainHeadings: PlainHeading[] = [];

  let headerRendingHook = (text: string, level: number): string => {
    text = filterHTMLTags(text);

    let id = calculateHeadingId(startFromId, plainHeadings, level);

    plainHeadings.push({text, level, id});

    id = feedDotWhenNone(id);

    return id;
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

function calculateHeadingId(
  startFromId: number,
  headings: PlainHeading[],
  level: number,
): string {
  const REGEX_LAST_NUMBER = /(?!\.)(\d+)$/;

  let lastHeadingIndex = headings.length - 1;

  let id = `${startFromId}`;

  if (lastHeadingIndex >= 0) {
    let {id: lastId, level: lastLevel} = headings[lastHeadingIndex];

    if (level > lastLevel) {
      id = lastId + '.1'.repeat(level - lastLevel);
    } else if (level === lastLevel) {
      let parallelId = lastId.match(REGEX_LAST_NUMBER)![0];

      let parallelIdNum = parseInt(parallelId);

      id = lastId.slice(0, -parallelId.length) + (parallelIdNum + 1);
    } else {
      let lastDotPosition: number | undefined;

      for (let i = 0; i < lastLevel - level; i++) {
        lastDotPosition = lastId.lastIndexOf('.', lastDotPosition);
      }

      if (lastDotPosition !== -1) {
        let parallelFullId = lastId.slice(0, lastDotPosition);

        let parallelId = parallelFullId.match(REGEX_LAST_NUMBER)![0];

        let parallelIdNum = parseInt(parallelId);

        id = parallelFullId.slice(0, -parallelId.length) + (parallelIdNum + 1);
      }
    }
  }

  return id;
}

function buildHeadingTree(headings: PlainHeading[]): Heading[] {
  let headingTree: Heading[] = [];

  let lastHeading: Heading | undefined;

  for (let {level, text, id} of headings) {
    id = feedDotWhenNone(id);

    let heading: Heading = {
      text,
      level,
      id,
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

    heading.id = encodeURI(`${id} ${heading.text}`);

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
