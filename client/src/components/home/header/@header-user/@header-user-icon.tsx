import classNames from 'classnames';
import React, {Component} from 'react';

import defaultAvatar from 'assets/images/default_avatar.svg';
import {styled} from 'theme';

const Wrapper = styled.div`
  width: 38px;
  height: 38px;

  img {
    width: 100%;
    height: 100%;
  }
`;

export interface HeaderUserIconProps {
  className?: string;
  icon?: string;
}

export class HeaderUserIcon extends Component<HeaderUserIconProps> {
  render() {
    let {className, icon} = this.props;

    return (
      <Wrapper className={classNames('header-user-icon', className)}>
        <img src={icon ? icon : defaultAvatar} />
      </Wrapper>
    );
  }

  static Wrapper = Wrapper;
}
