import classNames from 'classnames';
import highlight from 'highlight.js';
import marked from 'marked';
import React, {Component} from 'react';
import {RouteComponentProps, withRouter} from 'react-router';

import {ConventionStore} from 'stores/convention-store';
import {RouterStore} from 'stores/router-store';
import {styled} from 'theme';
import {inject, observer} from 'utils/mobx';
import {MarkdownStyle} from '../../../common';

const Wrapper = styled(MarkdownStyle)``;

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

marked.setOptions({
  highlight(code) {
    return highlight.highlightAuto(code).value;
  },
});

export interface ConventionBodyProps extends RouteComponentProps<any> {
  className?: string;
}

@observer
export class ConventionBody extends Component<ConventionBodyProps> {
  @inject
  routerStore!: RouterStore;

  @inject
  conventionStore!: ConventionStore;

  render() {
    let {className} = this.props;

    return (
      <Wrapper className={classNames('convention-body', className)}>
        <div
          className="markdown-body"
          dangerouslySetInnerHTML={{
            __html: marked(this.conventionStore.currentContent),
          }}
        />
        <div />
      </Wrapper>
    );
  }

  static Wrapper = Wrapper;
}

export const ConventionBodyWithRouter = withRouter(ConventionBody);
