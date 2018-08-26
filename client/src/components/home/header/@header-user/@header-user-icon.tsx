import {Avatar} from 'antd';
import classNames from 'classnames';
import React, {Component} from 'react';

import defaultAvatar from 'assets/images/default_avatar.svg';
import {styled} from 'theme';

const Wrapper = styled.div`
  width: 38px;
  height: 38px;
`;

export interface HeaderUserIconProps {
  className?: string;
  icon?: string;
}

export class HeaderUserIcon extends Component<HeaderUserIconProps> {
  render(): JSX.Element {
    let {className, icon} = this.props;

    return (
      <Wrapper className={classNames('header-user-icon', className)}>
        <Avatar src={icon ? icon : defaultAvatar} />
      </Wrapper>
    );
  }

  static Wrapper = Wrapper;
}
