import highlight from 'highlight.js';
import _marked from 'marked';

const renderer = new _marked.Renderer();

renderer.heading = (text: string, level: number, raw: string) => {
  return `<h${level} id="${encodeURI(raw)}">${text}</h${level}>\n`;
};

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

_marked.setOptions({
  highlight(code) {
    return highlight.highlightAuto(code).value;
  },
  renderer,
});

export interface SectionAnnotation {
  type: 'section';
  uuid: string;
  alias?: string;
}

export type LibrarianAnnotation = SectionAnnotation;

export interface Section {
  source: string;
  annotation?: SectionAnnotation;
}

export function splitIntoSections(source: string): Section[] {
  const pattern = /^<!-- @librarian: (.+) -->$/gm;

  let result: Section[] = [];

  // tslint:disable-next-line:no-null-keyword
  let lastMatch: RegExpExecArray | null = null;

  let match = pattern.exec(source);

  if (!match) {
    result.push({
      source,
    });
  }

  while (match) {
    if (lastMatch) {
      result.push({
        source: source.slice(lastMatch.index, match.index),
        annotation: JSON.parse(lastMatch[1]),
      });
    } else {
      result.push({
        source: source.slice(0, match.index),
      });
    }

    lastMatch = match;
    match = pattern.exec(source);
  }

  if (lastMatch) {
    result.push({
      source: source.slice(lastMatch.index),
      annotation: JSON.parse(lastMatch[1]),
    });
  }

  return result;
}

export const mark = _marked;
