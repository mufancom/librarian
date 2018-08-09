import {styled} from 'theme';

export const MarkdownStyle = styled.div`
  word-wrap: break-word;
  font-size: 14px;
  line-height: 1.5;

  h1,
  h2,
  h3,
  h4,
  h5,
  h5 {
    font-weight: 400;
    line-height: 1.25;
    color: ${props => props.theme.text.primary};
  }
  h1 {
    font-size: 2em;
  }
  h2 {
    padding-bottom: 0.4em;
    font-size: 1.5em;
  }
  h3 {
    font-size: 1.25em;
  }
  h4 {
    font-size: 1em;
  }
  h5 {
    font-size: 0.85em;
  }
  h6 {
    font-size: 0.85em;
    color: #6a737d;
  }
  a {
    color: ${props => props.theme.accent()};
    text-decoration: none;
  }
  a:hover {
    text-decoration: underline;
  }
  p,
  blockquote,
  ul,
  ol,
  dl,
  table,
  pre {
    margin-top: 0;
    margin-bottom: 16px;
    color: ${props => props.theme.text.regular};
  }
  ol,
  ul {
    padding-left: 1.3em;
  }
  li {
    list-style: initial;
    word-wrap: break-all;
    & > p {
      margin-top: 16px;
    }
    & + li {
      margin-top: 0.25em;
    }
  }
  dl {
    padding: 0;
  }
  dl dt {
    padding: 0;
    margin-top: 16px;
    font-size: 1em;
    font-style: italic;
    font-weight: 600;
  }
  dl dd {
    padding: 0 16px;
    margin-bottom: 16px;
  }
  table {
    display: block;
    width: 100%;
    overflow: auto;
    th {
      font-weight: 600;
    }
    th,
    td {
      padding: 6px 13px;
      border: 1px solid #dfe2e5;
    }
    tr {
      background-color: #fff;
      border-top: 1px solid #c6cbd1;
      &:nth-child(2n) {
        background-color: #f6f8fa;
      }
    }
    img {
      background-color: transparent;
    }
  }
  img {
    max-width: 100%;
    box-sizing: content-box;
    background-color: #fff;
  }
  hr {
    height: 0.25em;
    padding: 0;
    margin: 24px 0;
    background-color: #e1e4e8;
    border: 0;
  }
  blockquote {
    margin-left: 0;
    margin-right: 0;
    padding: 0 1em;
    color: #6a737d;
    border-left: 0.25em solid #dfe2e5;
    & > :first-child {
      margin-top: 0;
    }
    & > :last-child {
      margin-bottom: 0;
    }
  }
  code,
  tt {
    padding: 0.2em 0.4em;
    margin: 0;
    font-size: 85%;
    background-color: #f9fafc;
    border: 1px solid #eaeefb;
    border-radius: 4px;
    & br {
      display: none;
    }
  }
  pre {
    word-wrap: normal;
    padding: 16px;
    overflow: auto;
    font-size: 90%;
    line-height: 1.45;
    border-radius: 4px;
    background-color: #fafafa;
    border: 1px solid #eaeefb;
    margin-bottom: 1.5rem;
    code {
      font-size: 100%;
      white-space: pre;
    }
    code,
    tt {
      display: inline;
      max-width: auto;
      padding: 0;
      margin: 0;
      overflow: visible;
      line-height: inherit;
      word-wrap: normal;
      background-color: transparent;
      border: 0;
    }
  }

  /*
Atom One Light by Daniel Gamage
Original One Light Syntax theme from https://github.com/atom/one-light-syntax
base:    #fafafa
mono-1:  #383a42
mono-2:  #686b77
mono-3:  #a0a1a7
hue-1:   #0184bb
hue-2:   #4078f2
hue-3:   #a626a4
hue-4:   #50a14f
hue-5:   #e45649
hue-5-2: #c91243
hue-6:   #986801
hue-6-2: #c18401
*/

  .hljs {
    display: block;
    overflow-x: auto;
    padding: 0.5em;
    color: #383a42;
    background: #fafafa;
  }

  .hljs-comment,
  .hljs-quote {
    color: #a0a1a7;
    font-style: italic;
  }

  .hljs-doctag,
  .hljs-keyword,
  .hljs-formula {
    color: #a626a4;
  }

  .hljs-section,
  .hljs-name,
  .hljs-selector-tag,
  .hljs-deletion,
  .hljs-subst {
    color: #e45649;
  }

  .hljs-literal {
    color: #0184bb;
  }

  .hljs-string,
  .hljs-regexp,
  .hljs-addition,
  .hljs-attribute,
  .hljs-meta-string {
    color: #50a14f;
  }

  .hljs-built_in,
  .hljs-class .hljs-title {
    color: #c18401;
  }

  .hljs-attr,
  .hljs-variable,
  .hljs-template-variable,
  .hljs-type,
  .hljs-selector-class,
  .hljs-selector-attr,
  .hljs-selector-pseudo,
  .hljs-number {
    color: #986801;
  }

  .hljs-symbol,
  .hljs-bullet,
  .hljs-link,
  .hljs-meta,
  .hljs-selector-id,
  .hljs-title {
    color: #4078f2;
  }

  .hljs-emphasis {
    font-style: italic;
  }

  .hljs-strong {
    font-weight: bold;
  }

  .hljs-link {
    text-decoration: underline;
  }
`;
