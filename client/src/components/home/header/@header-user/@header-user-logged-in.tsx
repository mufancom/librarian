import {Dropdown, Menu, message} from 'antd';
import classNames from 'classnames';
import React, {Component, createRef} from 'react';
import ReactDOM from 'react-dom';

import {fetchErrorMessage} from 'services/api-service';
import {UserService} from 'services/user-service';
import {AuthStore} from 'stores/auth-store';
import {styled} from 'theme';
import {i18n} from 'utils/lang';
import {inject, observer} from 'utils/mobx';

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
  logoutOnclick: any,
  changeAvatarOnclick: any,
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
      <a href="#">修改密码</a>
    </Menu.Item>
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

  wrapperRef: React.RefObject<any> = createRef();

  render(): JSX.Element {
    let {className} = this.props;

    return (
      <Wrapper
        className={classNames('header-user-logged-in', className)}
        ref={this.wrapperRef}
      >
        <Dropdown
          overlay={createDropdownMenu(
            this.onMenuLogoutClick,
            this.onMenuChangeAvatarClick,
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

  static Wrapper = Wrapper;
}
