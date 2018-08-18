import {Icon} from 'antd';
import classNames from 'classnames';
import React, {Component, MouseEvent} from 'react';

import {styled} from 'theme';
import {observer} from 'utils/mobx';

const Wrapper = styled.div``;

const EditButton = styled.div`
  display: inline !important;
  color: ${props => props.theme.gray()} !important;
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

export interface ConventionSideNavEditBtnProps {
  className?: string;
  show: boolean;
  onClick?(): void;
}

@observer
export class ConventionSideNavEditBtn extends Component<
  ConventionSideNavEditBtnProps
> {
  render() {
    let {className, show} = this.props;

    return (
      <Wrapper
        className={classNames('convention-side-nav-edit-btn', className)}
      >
        <EditButton
          className={show ? 'show' : 'hide'}
          onClick={this.onInnerClick}
          title="重命名"
        >
          <Icon type="edit" />
        </EditButton>
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

  static Wrapper = Wrapper;
}
