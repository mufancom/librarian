import {Button} from 'antd';
import classNames from 'classnames';
import React, {Component} from 'react';

import {RouteComponentProps, withRouter} from 'react-router';
import {AuthStore} from 'stores/auth-store';
import {ConventionStore} from 'stores/convention-store';
import {styled} from 'theme';
import {inject, observer} from 'utils/mobx';

const Wrapper = styled.div`
  margin-bottom: 2.4rem;
`;

const ConventionTitle = styled.div`
  position: relative;

  .add-button {
    position: absolute;
    margin-left: 20px;
    top: 7px;
    padding: 0 5px !important;
    line-height: 10px;
    height: 25px;
    transition: all 0.3s;

    &.show {
      opacity: 1;
    }

    &.hide {
      opacity: 0;
    }
  }
`;

export interface ConventionBodyTitleProps extends RouteComponentProps<any> {
  className?: string;
  onAddConventionButtonClick?(): void;
}

@observer
export class ConventionBodyTitle extends Component<ConventionBodyTitleProps> {
  @inject
  authStore!: AuthStore;

  @inject
  conventionStore!: ConventionStore;

  render() {
    let {className, onAddConventionButtonClick} = this.props;
    let convention = this.conventionStore.currentConvention;

    return (
      <Wrapper className={classNames('convention-body-title', className)}>
        <h1>
          {convention ? (
            <ConventionTitle>
              {convention.title}
              <Button
                className={`add-button ${
                  this.authStore.isLoggedIn ? 'show' : 'hide'
                }`}
                type="dashed"
                icon="plus"
                onClick={onAddConventionButtonClick}
              />
            </ConventionTitle>
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
