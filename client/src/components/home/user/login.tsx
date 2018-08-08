import {Alert, Button, Icon, Input, Modal, message} from 'antd';
import classNames from 'classnames';
import React, {Component} from 'react';

import {fetchErrorMessage} from 'services/api-service';
import {UserService} from 'services/user-service';
import {styled} from 'theme';
import {translation} from 'utils/lang';
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
  errorMessage: string;
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
      errorMessage: '',
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
              message={this.state.errorMessage}
              type="error"
              style={{marginBottom: '15px'}}
              closable
              afterClose={this.handleErrorAlertClose}
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
              onPressEnter={this.handleLoginButtonOnclick}
            />
          </p>
          <p>
            <Input
              prefix={<Icon type="lock" style={{color: 'rgba(0,0,0,.25)'}} />}
              type="password"
              placeholder="密码"
              ref={this.passwordInput}
              onPressEnter={this.handleLoginButtonOnclick}
            />
          </p>
        </Modal>
      </Wrapper>
    );
  }

  async handleLoginButtonOnclick() {
    this.setState({loginLoading: true});

    let username = this.usernameInput.current!.input.value;
    let password = this.passwordInput.current!.input.value;

    try {
      let usernameOrEmail = await this.userService.login(username, password);

      message.success(translation.loginSuccess(usernameOrEmail));
    } catch (error) {
      let errorMessage = fetchErrorMessage(error);
      this.setState({errorAlertVisible: true, errorMessage});
    }

    this.setState({loginLoading: false});
  }

  handleErrorAlertClose() {
    this.setState({errorAlertVisible: false});
  }

  static Wrapper = Wrapper;
}
