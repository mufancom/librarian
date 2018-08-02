import classNames from 'classnames';
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

export interface HeaderUserUnloggedInProps {
  className?: string;
}

export interface HeaderUserUnloggedInState {
  userLoginVisible: boolean;
  userRegisterVisible: boolean;
}

@observer
export class HeaderUserUnloggedIn extends Component<
  HeaderUserUnloggedInProps,
  HeaderUserUnloggedInState
> {
  constructor(props: HeaderUserUnloggedInProps) {
    super(props);
    this.state = {
      userLoginVisible: false,
      userRegisterVisible: false,
    };
  }

  render() {
    let {className} = this.props;

    return (
      <div>
        <Wrapper
          onClick={this.loginOnClick.bind(this)}
          className={classNames('header-user-unlogged-in', className)}
        >
          <HeaderUserIcon />
          <div className="hint-text">未登录</div>
        </Wrapper>
        <Login
          visible={this.state.userLoginVisible}
          onCancel={this.loginOnCancel.bind(this)}
          onRegisterBtnClick={this.registerOnClick.bind(this)}
        />
        <Register
          visible={this.state.userRegisterVisible}
          onCancel={this.registerOnCancel.bind(this)}
          onLoginBtnClick={this.loginOnClick.bind(this)}
        />
      </div>
    );
  }

  loginOnClick() {
    this.setState({
      userLoginVisible: true,
      userRegisterVisible: false,
    });
  }

  loginOnCancel() {
    this.setState({
      userLoginVisible: false,
    });
  }

  registerOnClick() {
    this.setState({
      userLoginVisible: false,
      userRegisterVisible: true,
    });
  }

  registerOnCancel() {
    this.setState({
      userRegisterVisible: false,
    });
  }

  static Wrapper = Wrapper;
}
