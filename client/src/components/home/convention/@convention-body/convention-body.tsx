import classNames from 'classnames';
import React, {Component} from 'react';
import {RouteComponentProps, withRouter} from 'react-router';

import {ConventionStore} from 'stores/convention-store';
import {RouterStore} from 'stores/router-store';
import {styled} from 'theme';
import {splitIntoSections} from 'utils/markdown';
import {inject, observer} from 'utils/mobx';
import {MarkdownStyle} from '../../../common';
import {ConventionBodySection} from './@convention-body-section';

const Wrapper = styled(MarkdownStyle)`
  padding-top: 25px;
  padding-bottom: 20px;
`;

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
        <div className="markdown-body" />
        {splitIntoSections(this.conventionStore.currentContent).map(value => {
          let {source, annotation} = value;
          return (
            <ConventionBodySection
              key={annotation && annotation.uuid ? annotation.uuid : source}
              section={value}
            />
          );
        })}
        <div />
      </Wrapper>
    );
  }

  static Wrapper = Wrapper;
}

export const ConventionBodyWithRouter = withRouter(ConventionBody);
