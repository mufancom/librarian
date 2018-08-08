import {Dropdown, Menu, message} from 'antd';
import classNames from 'classnames';
import React, {Component} from 'react';

import {fetchErrorMessage} from 'services/api-service';
import {UserService} from 'services/user-service';
import {AuthStore} from 'stores/auth-store';
import {styled} from 'theme';
import {translation} from 'utils/lang';
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
    padding-left: 10px;
  }
`;

const createDropdownMenu = (logoutOnclick: any) => (
  <Menu
    getPopupContainer={() => document.body}
    style={{
      position: 'relative',
      marginTop: '-20px',
    }}
  >
    <Menu.Item>
      <a href="#">修改密码</a>
    </Menu.Item>
    <Menu.Divider />
    <Menu.Item>
      <a href="#" onClick={logoutOnclick}>
        退出
      </a>
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

  constructor(props: HeaderUserLoggedInProps) {
    super(props);
    this.handleLogoutOnclick = this.handleLogoutOnclick.bind(this);
  }

  render() {
    let {className} = this.props;

    return (
      <Wrapper className={classNames('header-user-logged-in', className)}>
        <Dropdown overlay={createDropdownMenu(this.handleLogoutOnclick)}>
          <a href="#">
            <HeaderUserIcon icon={this.authStore.avatar} />
            <div className="username-text">{this.authStore.username}</div>
          </a>
        </Dropdown>
      </Wrapper>
    );
  }

  async handleLogoutOnclick() {
    try {
      await this.userService.logout();

      message.success(translation.logoutSuccess);
    } catch (error) {
      message.error(fetchErrorMessage(error));
    }
  }

  static Wrapper = Wrapper;
}
