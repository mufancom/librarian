import {Button, Input, Modal} from 'antd';
import classNames from 'classnames';
import React, {Component} from 'react';

import {styled} from 'theme';
import {observer} from 'utils/mobx';

const Wrapper = styled.div``;

export interface RegisterProps {
  className?: string;
  visible: boolean;
  onCancel(): void;
  onLoginBtnClick(): void;
}

export interface RegisterState {
  registerLoading: boolean;
}

@observer
export class Register extends Component<RegisterProps, RegisterState> {
  constructor(props: RegisterProps) {
    super(props);
    this.state = {
      registerLoading: false,
    };
  }

  render() {
    let {className} = this.props;

    return (
      <Wrapper className={classNames('register', className)}>
        {' '}
        <Modal
          visible={this.props.visible}
          title="注册"
          onOk={this.handleOk}
          onCancel={this.props.onCancel}
          width="450px"
          footer={[
            <a
              key="login"
              onClick={this.props.onLoginBtnClick}
              style={{marginRight: '15px'}}
            >
              已有账号？去登录
            </a>,
            <Button
              key="register"
              type="primary"
              loading={this.state.registerLoading}
              onClick={this.handleOk}
            >
              立即注册
            </Button>,
          ]}
        >
          <p>
            <Input type="text" placeholder="用户名" />
          </p>
          <p>
            <Input type="text" placeholder="邮箱" />
          </p>
          <p>
            <Input type="password" placeholder="密码" />
          </p>
          <p>
            <Input type="password" placeholder="重复密码" />
          </p>
        </Modal>
      </Wrapper>
    );
  }

  handleOk() {}

  static Wrapper = Wrapper;
}
