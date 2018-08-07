import classNames from 'classnames';
import React, {Component} from 'react';

import {AuthStore} from 'stores/auth-store';
import {styled} from 'theme';
import {inject, observer} from 'utils/mobx';
import {HeaderUserIcon} from './@header-user-icon';

const Wrapper = styled.div`
  padding: 10px 4px;
  cursor: pointer;

  ${HeaderUserIcon.Wrapper} {
    float: left;
  }

  .username-text {
    float: left;
    padding-left: 10px;
  }
`;

export interface HeaderUserLoggedInProps {
  className?: string;
}

@observer
export class HeaderUserLoggedIn extends Component<HeaderUserLoggedInProps> {
  @inject
  authStore!: AuthStore;

  render() {
    let {className} = this.props;

    return (
      <Wrapper className={classNames('header-user-logged-in', className)}>
        <HeaderUserIcon icon={this.authStore.avatar} />
        <div className="username-text">{this.authStore.username}</div>
      </Wrapper>
    );
  }

  static Wrapper = Wrapper;
}
