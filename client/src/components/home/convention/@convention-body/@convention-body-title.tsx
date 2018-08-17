import classNames from 'classnames';
import React, {Component} from 'react';

import {RouteComponentProps, withRouter} from 'react-router';
import {ConventionStore} from 'stores/convention-store';
import {styled} from 'theme';
import {inject, observer} from 'utils/mobx';

const Wrapper = styled.div`
  margin-bottom: 2.4rem;
`;

export interface ConventionBodyTitleProps extends RouteComponentProps<any> {
  className?: string;
}

@observer
export class ConventionBodyTitle extends Component<ConventionBodyTitleProps> {
  @inject
  conventionStore!: ConventionStore;

  render() {
    let {className} = this.props;
    let convention = this.conventionStore.currentConvention;

    return (
      <Wrapper className={classNames('convention-body-title', className)}>
        <h1>
          {convention ? (
            <div>{convention.title}</div>
          ) : (
            <div style={{color: '#bbb'}}>Loading ...</div>
          )}
        </h1>
      </Wrapper>
    );
  }

  static Wrapper = Wrapper;
}

export const ConventionBodyTitleWithRouter = withRouter(ConventionBodyTitle);
