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

export const mark = _marked;
