import classNames from 'classnames';
import React, {Component} from 'react';
import {RouteComponentProps, withRouter} from 'react-router';

import {ConventionStore} from 'stores/convention-store';
import {RouterStore} from 'stores/router-store';
import {styled} from 'theme';
import {inject, observer} from 'utils/mobx';
import {MarkdownStyle} from '../../../common';
import {ConventionBodyItem} from './@convention-body-item';
import {ConventionBodyTitle} from './@convention-body-title';

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
      <Wrapper
        className={classNames('convention-body', className, 'markdown-body')}
      >
        <ConventionBodyTitle {...this.props} />
        {this.conventionStore.currentContent.map(value => {
          return <ConventionBodyItem key={value.id} item={value} />;
        })}
      </Wrapper>
    );
  }

  static Wrapper = Wrapper;
}

export const ConventionBodyWithRouter = withRouter(ConventionBody);
