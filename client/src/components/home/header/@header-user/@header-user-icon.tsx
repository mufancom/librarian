import {Avatar} from 'antd';
import classNames from 'classnames';
import React, {Component} from 'react';

import {styled} from 'theme';

const Wrapper = styled.div`
  width: 38px;
  height: 38px;

  .avatar {
    i {
    }
  }
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
        <Avatar className="avatar" icon="user" src={icon} />
      </Wrapper>
    );
  }

  static Wrapper = Wrapper;
}
