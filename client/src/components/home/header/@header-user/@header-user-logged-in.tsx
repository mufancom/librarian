import {Dropdown, Menu, Switch, message} from 'antd';
import classNames from 'classnames';
import {action, observable} from 'mobx';
import React, {Component, createRef} from 'react';
import ReactDOM from 'react-dom';

import {fetchErrorMessage} from 'services/api-service';
import {UserService} from 'services/user-service';
import {AuthStore} from 'stores/auth-store';
import {styled} from 'theme';
import {i18n} from 'utils/lang';
import {inject, observer} from 'utils/mobx';

import {InputModal, ThreeInputModal} from '../../../common';

import {HeaderUserIcon} from './@header-user-icon';

const Wrapper = styled.div`
  padding: 10px 4px;
  cursor: pointer;

  ${HeaderUserIcon.Wrapper} {
    float: left;
  }

  .username-text {
    float: left;
    padding-left: 2px;
  }
`;

const createDropdownMenu = (
  showInvite: boolean,
  logoutOnclick?: () => void,
  changeAvatarOnclick?: () => void,
  changePasswordOnclick?: () => void,
  inviteOnclick?: () => void,
): JSX.Element => (
  <Menu
    getPopupContainer={() => document.body}
    style={{
      marginTop: '-30px',
    }}
  >
    <Menu.Item>
      <a onClick={changeAvatarOnclick}>修改头像</a>
    </Menu.Item>
    <Menu.Item>
      <a onClick={changePasswordOnclick}>修改密码</a>
    </Menu.Item>
    <Menu.Divider />
    {showInvite ? (
      <Menu.Item>
        <a onClick={inviteOnclick}>邀请注册</a>
      </Menu.Item>
    ) : (
      undefined
    )}
    <Menu.Divider />
    <Menu.Item>
      <a onClick={logoutOnclick}>退出</a>
    </Menu.Item>
  </Menu>
);

export interface HeaderUserLoggedInProps {
  className?: string;
}

@observer
export class HeaderUserLoggedIn extends Component<HeaderUserLoggedInProps> {
  @inject
  authStore!: AuthStore;

  @inject
  userService!: UserService;

  @observable
  inviteModalVisible = false;

  @observable
  inviteModalLoading = false;

  @observable
  changePasswordModalVisible = false;

  @observable
  changePasswordModalLoading = false;

  wrapperRef: React.RefObject<any> = createRef();

  render(): JSX.Element {
    let {className} = this.props;

    return (
      <Wrapper
        className={classNames('header-user-logged-in', className)}
        ref={this.wrapperRef}
      >
        <InputModal
          visible={this.inviteModalVisible}
          title="邀请注册"
          placeholder="被邀请邮箱地址"
          loading={this.inviteModalLoading}
          onOkButtonClick={this.onInviteModalOkClick}
          onCancelButtonClick={this.onInviteModalCancelClick}
        />
        <ThreeInputModal
          visible={this.changePasswordModalVisible}
          title="更改密码"
          firstPlaceholder="旧密码"
          firstType="password"
          secondPlaceholder="新密码"
          secondType="password"
          thirdPlaceholder="重复新密码"
          thirdType="password"
          loading={this.changePasswordModalLoading}
          onOkButtonClick={this.onChangePasswordModalOkClick}
          onCancelButtonClick={this.onChangePasswordModalCancelClick}
        />
        <Dropdown
          overlay={createDropdownMenu(
            this.authStore.registerInvitationEnabled,
            this.onMenuLogoutClick,
            this.onMenuChangeAvatarClick,
            this.onChangePasswordClick,
            this.onInviteClick,
          )}
          getPopupContainer={this.getWrapperDom}
        >
          <a>
            <HeaderUserIcon icon={this.authStore.avatar} />
            <div className="username-text">{this.authStore.username}</div>
          </a>
        </Dropdown>
      </Wrapper>
    );
  }

  getWrapperDom = (): HTMLLIElement => {
    return ReactDOM.findDOMNode(this.wrapperRef.current) as HTMLLIElement;
  };

  onMenuChangeAvatarClick = (): void => {
    window.open(this.userService.getAvatarProfileUrl(this.authStore.email));
  };

  onMenuLogoutClick = async (): Promise<void> => {
    try {
      await this.userService.logout();

      message.success(i18n.LOGOUT_SUCCESS);
    } catch (error) {
      message.error(fetchErrorMessage(error));
    }
  };

  @action
  onChangePasswordClick = (): void => {
    this.changePasswordModalVisible = true;
  };

  @action
  onInviteClick = (): void => {
    this.inviteModalVisible = true;
  };

  @action
  onInviteModalOkClick = async (value: string): Promise<void> => {
    this.inviteModalLoading = true;

    try {
      await this.userService.generateInvitation(value);

      this.inviteModalVisible = false;

      message.success('邀请链接已发送');
    } catch (error) {
      let errorMessage = fetchErrorMessage(error);

      message.error(errorMessage);
    }

    this.inviteModalLoading = false;
  };

  @action
  onInviteModalCancelClick = (): void => {
    this.inviteModalVisible = false;
  };

  @action
  onChangePasswordModalOkClick = async (
    oldPassword: string,
    newPassword: string,
    repeatPassword: string,
  ): Promise<void> => {
    this.changePasswordModalLoading = true;

    try {
      if (newPassword !== repeatPassword) {
        throw new Error('两次输入密码不一致');
      }

      await this.userService.changePassword(oldPassword, newPassword);

      this.changePasswordModalVisible = false;

      message.success('密码已成功更改');
    } catch (error) {
      let errorMessage = fetchErrorMessage(error);

      message.error(errorMessage);
    }

    this.changePasswordModalLoading = false;
  };

  @action
  onChangePasswordModalCancelClick = (): void => {
    this.changePasswordModalVisible = false;
  };

  static Wrapper = Wrapper;
}
