import {Alert, Button, Input, Modal, message} from 'antd';
import classNames from 'classnames';
import {action, observable} from 'mobx';
import React, {Component} from 'react';

import {fetchErrorMessage} from 'services/api-service';
import {UserService} from 'services/user-service';
import {styled} from 'theme';
import {translation} from 'utils/lang';
import {inject, observer} from 'utils/mobx';

const Wrapper = styled.div``;

export interface RegisterProps {
  className?: string;
  visible: boolean;
  onCancel(): void;
  onLoginBtnClick(): void;
}

@observer
export class Register extends Component<RegisterProps> {
  @inject
  userService!: UserService;

  @observable
  registerLoading = false;

  @observable
  errorAlertVisible = false;

  @observable
  errorMessage = '';

  private usernameInput: React.RefObject<Input>;
  private emailInput: React.RefObject<Input>;
  private passwordInput: React.RefObject<Input>;
  private passwordRepeatInput: React.RefObject<Input>;

  @observable
  loading = false;

  constructor(props: RegisterProps) {
    super(props);

    this.usernameInput = React.createRef();
    this.emailInput = React.createRef();
    this.passwordInput = React.createRef();
    this.passwordRepeatInput = React.createRef();

    this.onRegisterButtonClick = this.onRegisterButtonClick.bind(this);
    this.onErrorAlertClose = this.onErrorAlertClose.bind(this);
  }

  render() {
    let {className, visible, onCancel, onLoginBtnClick} = this.props;

    return (
      <Wrapper className={classNames('register', className)}>
        {' '}
        <Modal
          visible={visible}
          title="注册"
          onOk={this.onRegisterButtonClick}
          onCancel={onCancel}
          width="450px"
          footer={[
            <a
              key="login"
              onClick={onLoginBtnClick}
              style={{marginRight: '15px'}}
            >
              已有账号？去登录
            </a>,
            <Button
              key="register"
              type="primary"
              loading={this.registerLoading}
              onClick={this.onRegisterButtonClick}
            >
              立即注册
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
            <Input type="text" ref={this.usernameInput} placeholder="用户名" />
          </p>
          <p>
            <Input type="text" ref={this.emailInput} placeholder="邮箱" />
          </p>
          <p>
            <Input
              type="password"
              ref={this.passwordInput}
              placeholder="密码"
            />
          </p>
          <p>
            <Input
              type="password"
              ref={this.passwordRepeatInput}
              placeholder="重复密码"
            />
          </p>
        </Modal>
      </Wrapper>
    );
  }

  @action
  async onRegisterButtonClick() {
    this.registerLoading = true;

    const username = this.usernameInput.current!.input.value;
    const email = this.emailInput.current!.input.value;
    const password = this.passwordInput.current!.input.value;
    const passwordRepeat = this.passwordRepeatInput.current!.input.value;

    if (password !== passwordRepeat) {
      this.errorAlertVisible = true;
      this.errorMessage = translation.passwordsNotConsistent;
      this.registerLoading = false;
      return;
    }

    try {
      await this.userService.register(username, email, password);

      message.success(translation.registerSuccess);
      this.props.onCancel();
    } catch (error) {
      let errorMessage = fetchErrorMessage(error);

      this.errorAlertVisible = true;
      this.errorMessage = errorMessage;
    }

    this.registerLoading = false;
  }

  @action
  onErrorAlertClose() {
    this.errorAlertVisible = false;
  }

  static Wrapper = Wrapper;
}
