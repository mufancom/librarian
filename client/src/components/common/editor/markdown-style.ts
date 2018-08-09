import {styled} from 'theme';

export const MarkdownStyle = styled.div`
  .markdown-body {
    word-wrap: break-word;
    font-size: 14px;
    line-height: 1.5;
    h1,
    h2,
    h3,
    h4,
    h5,
    h5 {
      margin-top: 24px;
      margin-bottom: 16px;
      font-weight: 400;
      line-height: 1.25;
      color: ${props => props.theme.text.primary};
    }
    h1 {
      padding-bottom: 0.3em;
      font-size: 2em;
    }
    h2 {
      padding-top: 0.5em;
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
      font-size: 85%;
      line-height: 1.45;
      border-radius: 4px;
      background-color: #fafafa;
      border: 1px solid #eaeefb;
      margin-bottom: 1.6rem;
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
  }

  /* Base16 Atelier Cave Light - Theme */
  /* by Bram de Haan (http://atelierbram.github.io/syntax-highlighting/atelier-schemes/cave) */
  /* Original Base16 color scheme by Chris Kempson (https://github.com/chriskempson/base16) */

  /* Atelier-Cave Comment */
  .hljs-comment,
  .hljs-quote {
    color: #655f6d;
  }

  /* Atelier-Cave Red */
  .hljs-variable,
  .hljs-template-variable,
  .hljs-attribute,
  .hljs-tag,
  .hljs-name,
  .hljs-regexp,
  .hljs-link,
  .hljs-name,
  .hljs-name,
  .hljs-selector-id,
  .hljs-selector-class {
    color: #be4678;
  }

  /* Atelier-Cave Orange */
  .hljs-number,
  .hljs-meta,
  .hljs-built_in,
  .hljs-builtin-name,
  .hljs-literal,
  .hljs-type,
  .hljs-params {
    color: #aa573c;
  }

  /* Atelier-Cave Green */
  .hljs-string,
  .hljs-symbol,
  .hljs-bullet {
    color: #2a9292;
  }

  /* Atelier-Cave Blue */
  .hljs-title,
  .hljs-section {
    color: #576ddb;
  }

  /* Atelier-Cave Purple */
  .hljs-keyword,
  .hljs-selector-tag {
    color: #955ae7;
  }

  .hljs-deletion,
  .hljs-addition {
    color: #19171c;
    display: inline-block;
    width: 100%;
  }

  .hljs-deletion {
    background-color: #be4678;
  }

  .hljs-addition {
    background-color: #2a9292;
  }

  .hljs {
    display: block;
    overflow-x: auto;
    background: #efecf4;
    color: #585260;
    padding: 0.5em;
  }

  .hljs-emphasis {
    font-style: italic;
  }

  .hljs-strong {
    font-weight: bold;
  }
`;
