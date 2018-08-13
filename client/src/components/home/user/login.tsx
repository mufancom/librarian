import {Alert, Button, Icon, Input, Modal, message} from 'antd';
import classNames from 'classnames';
import {action, observable} from 'mobx';
import React, {Component} from 'react';

import {fetchErrorMessage} from 'services/api-service';
import {UserService} from 'services/user-service';
import {styled} from 'theme';
import {i18n} from 'utils/lang';
import {inject, observer} from 'utils/mobx';

const Wrapper = styled.div``;

export interface LoginProps {
  className?: string;
  visible: boolean;
  onCancel(): void;
  onRegisterBtnClick(): void;
}

@observer
export class Login extends Component<LoginProps> {
  @inject
  userService!: UserService;

  @observable
  loginLoading = false;

  @observable
  errorAlertVisible = false;

  @observable
  errorMessage = '';

  private usernameInput: React.RefObject<Input>;
  private passwordInput: React.RefObject<Input>;

  constructor(props: any) {
    super(props);

    this.usernameInput = React.createRef();
    this.passwordInput = React.createRef();
  }

  render() {
    let {className, onCancel, onRegisterBtnClick, visible} = this.props;

    return (
      <Wrapper className={classNames('login', className)}>
        <Modal
          visible={visible}
          title="登录"
          onOk={this.onLoginButtonOnclick}
          onCancel={onCancel}
          width="400px"
          footer={[
            <a
              key="register"
              onClick={onRegisterBtnClick}
              style={{marginRight: '15px'}}
            >
              注册账号
            </a>,
            <Button
              key="login"
              type="primary"
              loading={this.loginLoading}
              onClick={this.onLoginButtonOnclick}
            >
              登录
            </Button>,
          ]}
        >
          {this.errorAlertVisible ? (
            <Alert
              message={this.errorMessage}
              type="error"
              style={{marginBottom: '15px'}}
              closable
              afterClose={this.onErrorAlertClose}
            />
          ) : (
            undefined
          )}
          <p>
            <Input
              prefix={<Icon type="user" style={{color: 'rgba(0,0,0,.25)'}} />}
              type="text"
              placeholder="用户名/邮箱"
              ref={this.usernameInput}
              onPressEnter={this.onLoginButtonOnclick}
            />
          </p>
          <p>
            <Input
              prefix={<Icon type="lock" style={{color: 'rgba(0,0,0,.25)'}} />}
              type="password"
              placeholder="密码"
              ref={this.passwordInput}
              onPressEnter={this.onLoginButtonOnclick}
            />
          </p>
        </Modal>
      </Wrapper>
    );
  }

  @action
  private onLoginButtonOnclick = async () => {
    this.loginLoading = true;

    let username = this.usernameInput.current!.input.value;
    let password = this.passwordInput.current!.input.value;

    try {
      let usernameOrEmail = await this.userService.login(username, password);

      message.success(i18n.LOGIN_SUCCESS(usernameOrEmail));
    } catch (error) {
      let errorMessage = fetchErrorMessage(error);

      this.errorAlertVisible = true;
      this.errorMessage = errorMessage;
    }

    this.loginLoading = false;
  };

  @action
  private onErrorAlertClose = () => {
    this.errorAlertVisible = false;
  };

  static Wrapper = Wrapper;
}
