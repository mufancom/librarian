import {Icon, Popconfirm} from 'antd';
import classNames from 'classnames';
import React, {Component, MouseEvent} from 'react';

import {styled} from 'theme';
import {observer} from 'utils/mobx';

const Wrapper = styled.div`
  display: inline !important;
  margin-left: 5px;
`;

const DeleteButton = styled.div`
  display: inline !important;
  color: ${props => props.theme.dangerAccent()} !important;
  opacity: 0.3;
  transition: all 0.3s;
  cursor: pointer;

  &.show {
    opacity: 0.3;

    &:hover {
      opacity: 0.7;
      transition: all 0.3s;
    }
  }

  &.hide {
    opacity: 0;
    visible: hidden;
    position: absolute;
    top: -999999px;
  }
`;

export interface ConventionSideNavDeleteBtnProps {
  className?: string;
  show: boolean;
  onClick?(): void;
}

@observer
export class ConventionSideNavDeleteBtn extends Component<
  ConventionSideNavDeleteBtnProps
> {
  render() {
    let {className, show} = this.props;

    return (
      <Wrapper
        className={classNames('convention-side-nav-delete-btn', className)}
      >
        <Popconfirm
          title="您确定删除？"
          okText="确定"
          cancelText="取消"
          onConfirm={this.onInnerClick}
          onCancel={this.onInnerCancel}
          placement="right"
        >
          <DeleteButton className={show ? 'show' : 'hide'} title="删除">
            <Icon type="close" />
          </DeleteButton>
        </Popconfirm>
      </Wrapper>
    );
  }

  onInnerClick = (e: MouseEvent) => {
    e.preventDefault();

    let {onClick} = this.props;

    if (onClick) {
      onClick();
    }
  };

  onInnerCancel = (e: MouseEvent) => {
    e.preventDefault();
  };

  static Wrapper = Wrapper;
}
