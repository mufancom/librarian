import _highlight from 'highlight.js';

_highlight.configure({
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

export function highlight(code: string): string {
  return _highlight.highlightAuto(code).value;
}
