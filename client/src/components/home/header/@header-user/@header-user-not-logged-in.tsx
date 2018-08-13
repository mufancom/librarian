import classNames from 'classnames';
import {action, observable} from 'mobx';
import React, {Component} from 'react';

import {styled} from 'theme';
import {observer} from 'utils/mobx';
import {Login, Register} from '../../user';
import {HeaderUserIcon} from './@header-user-icon';

const Wrapper = styled.div`
  padding: 10px 4px;
  cursor: pointer;

  ${HeaderUserIcon.Wrapper} {
    float: left;
  }

  .hint-text {
    float: left;
    padding-left: 10px;
  }
`;

export interface HeaderUserNotLoggedInProps {
  className?: string;
}

@observer
export class HeaderUserNotLoggedIn extends Component<
  HeaderUserNotLoggedInProps
> {
  @observable
  userLoginVisible = false;

  @observable
  userRegisterVisible = false;

  render() {
    let {className} = this.props;

    return (
      <div>
        <Wrapper
          onClick={this.loginOnClick.bind(this)}
          className={classNames('header-user-not-logged-in', className)}
        >
          <HeaderUserIcon />
          <div className="hint-text">未登录</div>
        </Wrapper>
        <Login
          visible={this.userLoginVisible}
          onCancel={this.loginOnCancel.bind(this)}
          onRegisterBtnClick={this.registerOnClick.bind(this)}
        />
        <Register
          visible={this.userRegisterVisible}
          onCancel={this.registerOnCancel.bind(this)}
          onLoginBtnClick={this.loginOnClick.bind(this)}
        />
      </div>
    );
  }

  @action
  loginOnClick() {
    this.userLoginVisible = true;
    this.userRegisterVisible = false;
  }

  @action
  loginOnCancel() {
    this.userLoginVisible = false;
  }

  @action
  registerOnClick() {
    this.userLoginVisible = false;
    this.userRegisterVisible = true;
  }

  @action
  registerOnCancel() {
    this.userRegisterVisible = false;
  }

  static Wrapper = Wrapper;
}
