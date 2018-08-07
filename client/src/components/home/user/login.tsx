import {Alert, Button, Input, Modal} from 'antd';
import classNames from 'classnames';
import React, {Component} from 'react';

import {APIErrorCode, APIErrorException} from 'services/api-service';
import {UserService} from 'services/user-service';
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
  errorAlertVisible: boolean;
}

@observer
export class Login extends Component<LoginProps, LoginState> {
  @inject
  userService!: UserService;
  private usernameInput: React.RefObject<Input>;
  private passwordInput: React.RefObject<Input>;

  constructor(props: any) {
    super(props);

    this.state = {
      loginLoading: false,
      errorAlertVisible: false,
    };

    this.usernameInput = React.createRef();
    this.passwordInput = React.createRef();

    this.handleLoginButtonOnclick = this.handleLoginButtonOnclick.bind(this);
    this.handleErrorAlertClose = this.handleErrorAlertClose.bind(this);
  }

  render() {
    let {className} = this.props;

    return (
      <Wrapper className={classNames('login', className)}>
        <Modal
          visible={this.props.visible}
          title="登录"
          onOk={this.handleLoginButtonOnclick}
          onCancel={this.props.onCancel}
          width="400px"
          footer={[
            <a
              key="register"
              onClick={this.props.onRegisterBtnClick}
              style={{marginRight: '15px'}}
            >
              注册账号
            </a>,
            <Button
              key="login"
              type="primary"
              loading={this.state.loginLoading}
              onClick={this.handleLoginButtonOnclick}
            >
              登录
            </Button>,
          ]}
        >
          {this.state.errorAlertVisible ? (
            <Alert
              message="Alert Message Text"
              type="success"
              style={{marginBottom: '14px'}}
              closable
              afterClose={this.handleErrorAlertClose}
            />
          ) : (
            undefined
          )}
          <p>
            <Input type="text" placeholder="用户名" ref={this.usernameInput} />
          </p>
          <p>
            <Input
              type="password"
              placeholder="密码"
              ref={this.passwordInput}
            />
          </p>
        </Modal>
      </Wrapper>
    );
  }

  async handleLoginButtonOnclick() {
    const username = (this.usernameInput.current as Input).input.value;
    const password = (this.passwordInput.current as Input).input.value;
    try {
      await this.userService.login(username, password);
    } catch (e) {
      let errorMessage: string;
      if (e instanceof APIErrorException) {
        switch (e.code) {
          case APIErrorCode.authenticationFailed:
            errorMessage = '用户名或密码错误';
            break;
          default:
            errorMessage = '未知错误';
            break;
        }
      }
    }
  }

  handleErrorAlertClose() {}

  static Wrapper = Wrapper;
}
