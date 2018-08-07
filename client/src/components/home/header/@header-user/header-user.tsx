import classNames from 'classnames';
import React, {Component} from 'react';

import {AuthStore} from 'stores/auth-store';
import {styled} from 'theme';
import {inject, observer} from 'utils/mobx';
import {HeaderUserLoggedIn} from './@header-user-logged-in';
import {HeaderUserUnloggedIn} from './@header-user-unlogged-in';

const Wrapper = styled.div``;

export interface HeaderUserProps {
  className?: string;
}

@observer
export class HeaderUser extends Component<HeaderUserProps> {
  @inject
  authStore!: AuthStore;

  render() {
    let {className} = this.props;

    return (
      <Wrapper className={classNames('header-user', className)}>
        {this.authStore.isLoggedIn ? (
          <HeaderUserLoggedIn />
        ) : (
          <HeaderUserUnloggedIn />
        )}
      </Wrapper>
    );
  }

  static Wrapper = Wrapper;
}
