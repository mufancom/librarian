import highlight from 'highlight.js';
import _marked from 'marked';
import prettierBabylonParser from 'prettier/parser-babylon';
import prettierMarkdownParser from 'prettier/parser-markdown';
import prettierPostCSS from 'prettier/parser-postcss';
import prettierTypescriptParser from 'prettier/parser-typescript';
import prettier from 'prettier/standalone';

const prettierPlugins = [
  prettierMarkdownParser,
  prettierTypescriptParser,
  prettierPostCSS,
  prettierBabylonParser,
];

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

export const mark = _marked;

export function prettify(markdown: string): string {
  return prettier.format(markdown, {
    parser: 'markdown',
    plugins: prettierPlugins as any,
  });
}
