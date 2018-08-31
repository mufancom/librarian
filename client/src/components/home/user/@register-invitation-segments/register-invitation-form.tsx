import {Button, Col, Form, Icon, Input, Row, message} from 'antd';
import {FormComponentProps} from 'antd/lib/form/Form';
import classNames from 'classnames';
import {action, observable} from 'mobx';
import React, {Component, FormEvent} from 'react';

import {fetchErrorMessage} from 'services/api-service';
import {UserService} from 'services/user-service';
import {styled} from 'theme';
import {inject, observer} from 'utils/mobx';

import {RegisterInvitationLogo} from './@register-invitation-logo';

const {Item: FormItem} = Form;

const Wrapper = styled.div``;

const Header = styled.div`
  display: block;
  animation: fadeUpIn 0.3s;
`;

const Content = styled.div`
  margin-top: 35px;
  padding: 25px 25px 5px 25px;
  background-color: #fff;
  border-radius: 4px;
  border: 1px solid ${props => props.theme.border.light};
  animation: fadeUpIn 0.5s;
`;

const FormTitle = styled.div`
  margin-top: 10px;
  margin-bottom: 25px;
  font-size: 20px;
  color: ${props => props.theme.text.primary};
`;

const FormFooter = styled.div`
  display: flex;
  justify-content: space-between;
`;

const HomeLink = styled.a``;

interface RegisterFromProps {
  email: string;
  loading?: boolean;
  onSubmit?(username: string, password: string): void;
}

@observer
class RegisterForm extends Component<RegisterFromProps & FormComponentProps> {
  @observable
  confirmDirty = false;

  componentDidMount(): void {
    let {email, form} = this.props;

    form.setFieldsValue({email});
  }

  render(): JSX.Element {
    let {loading} = this.props;

    let {getFieldDecorator} = this.props.form;

    return (
      <Form onSubmit={this.handleSubmit} className="login-form">
        <FormItem>
          {getFieldDecorator('email')(
            <Input
              prefix={<Icon type="mail" style={{color: 'rgba(0,0,0,.25)'}} />}
              placeholder="邮箱"
              disabled
            />,
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('username', {
            rules: [
              {required: true, message: '请输入用户名!'},
              {min: 4, max: 20, message: '用户名长度为4-20位'},
            ],
          })(
            <Input
              prefix={<Icon type="user" style={{color: 'rgba(0,0,0,.25)'}} />}
              placeholder="用户名"
            />,
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('password', {
            rules: [
              {
                required: true,
                message: '请输入密码!',
              },
              {min: 8, max: 48, message: '密码长度为8-48位'},
              {
                validator: this.validateToNextPassword,
              },
            ],
          })(
            <Input
              prefix={<Icon type="lock" style={{color: 'rgba(0,0,0,.25)'}} />}
              type="password"
              placeholder="密码"
            />,
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('passwordConfirm', {
            rules: [
              {
                required: true,
                message: '两次密码输入不一致!',
              },
              {
                validator: this.compareToFirstPassword,
              },
            ],
          })(
            <Input
              prefix={<Icon type="lock" style={{color: 'rgba(0,0,0,.25)'}} />}
              type="password"
              placeholder="重复密码"
            />,
          )}
        </FormItem>
        <FormItem>
          <FormFooter>
            <Button
              type="primary"
              htmlType="submit"
              className="login-form-button"
              loading={loading}
            >
              注册
            </Button>
            <HomeLink href="/">
              访问 Librarian <Icon type="arrow-right" />
            </HomeLink>
          </FormFooter>
        </FormItem>
      </Form>
    );
  }

  compareToFirstPassword = (_rule: any, value: any, callback: any): void => {
    const form = this.props.form;

    if (value && value !== form.getFieldValue('password')) {
      callback('两次输入的密码不一致!');
    } else {
      callback();
    }
  };

  validateToNextPassword = (_rule: any, value: any, callback: any): void => {
    const form = this.props.form;

    if (value && this.confirmDirty) {
      form.validateFields(['confirm'], {force: true}, () => {});
    }

    callback();
  };

  handleSubmit = (event: FormEvent): void => {
    let {onSubmit} = this.props;

    event.preventDefault();
    this.props.form.validateFieldsAndScroll((err: any, values: any) => {
      if (!err) {
        if (onSubmit) {
          onSubmit(values.username, values.password);
        }
      }
    });
  };
}

const WrappedRegisterForm = Form.create<RegisterFromProps>()(RegisterForm);

export interface RegisterInvitationFormProps {
  className?: string;
  email: string;
  onFinish?(): void;
}

@observer
export class RegisterInvitationForm extends Component<
  RegisterInvitationFormProps
> {
  @inject
  userService!: UserService;

  @observable
  loading = false;

  render(): JSX.Element {
    let {className, email} = this.props;

    return (
      <Wrapper className={classNames('register-invitation-form', className)}>
        <Row
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            zIndex: 20,
          }}
        >
          <Col
            xs={{span: 24, offset: 0}}
            sm={{span: 12, offset: 6}}
            lg={{span: 10, offset: 7}}
            xl={{span: 8, offset: 8}}
            xxl={{span: 6, offset: 9}}
            style={{padding: '20vh 20px 20px 20px'}}
          >
            <Header>
              <RegisterInvitationLogo />
            </Header>
            <Content>
              <FormTitle>邀请注册</FormTitle>
              <WrappedRegisterForm
                email={email}
                onSubmit={this.onSubmit}
                loading={this.loading}
              />
            </Content>
          </Col>
        </Row>
      </Wrapper>
    );
  }

  @action
  onSubmit = async (username: string, password: string): Promise<void> => {
    this.loading = true;

    let {onFinish} = this.props;

    try {
      await this.userService.registerWithInvitation(username, password);

      if (onFinish) {
        onFinish();
      }
    } catch (error) {
      let errorMessage = fetchErrorMessage(error);

      message.error(errorMessage);
    }

    this.loading = false;
  };

  static Wrapper = Wrapper;
}
