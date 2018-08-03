import {Button, Input, Modal} from 'antd';
import classNames from 'classnames';
import React, {Component} from 'react';

import {AuthStore} from 'stores';
import {styled} from 'theme';
import {inject, observer} from 'utils/mobx';

const Wrapper = styled.div``;

export interface LoginProps {
  className?: string;
  visible: boolean;
  onCancel(): void;
  onRegisterBtnClick(): void;
}

export interface LoginState {
  loginLoading: boolean;
}

@observer
export class Login extends Component<LoginProps, LoginState> {
  @inject
  authStore!: AuthStore;

  constructor(props: any) {
    super(props);

    this.state = {
      loginLoading: false,
    };
  }

  render() {
    let {className} = this.props;

    return (
      <Wrapper className={classNames('login', className)}>
        <Modal
          visible={this.props.visible}
          title="登录"
          onOk={this.handleOk}
          onCancel={this.props.onCancel}
          width="400px"
          footer={[
            <a
              onClick={this.props.onRegisterBtnClick}
              style={{marginRight: '15px'}}
            >
              注册账号
            </a>,
            <Button
              key="submit"
              type="primary"
              loading={this.state.loginLoading}
              onClick={this.handleOk}
            >
              登录
            </Button>,
          ]}
        >
          <p>
            <Input
              type="text"
              placeholder="用户名"
              value={this.authStore.username}
            />
          </p>
          <p>
            <Input type="password" placeholder="密码" />
          </p>
        </Modal>
      </Wrapper>
    );
  }

  handleOk() {}

  static Wrapper = Wrapper;
}
