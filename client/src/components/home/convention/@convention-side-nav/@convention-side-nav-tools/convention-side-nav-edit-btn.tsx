import {Button, Icon} from 'antd';
import classNames from 'classnames';
import React, {Component, MouseEvent} from 'react';

import {styled} from 'theme';
import {observer} from 'utils/mobx';

const Wrapper = styled.div`
  display: inline !important;
  margin-left: 5px;

  .finish-button {
    top: -2px;
    height: 17px;
    font-size: 10px;
    line-height: 16px;
    padding-left: 2px !important;
    padding-right: 2px !important;
  }
`;

const FinishButton = styled.div`
  display: inline !important;
`;

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
  editMode: boolean;
  editLoading?: boolean;
  onClick?(): void;
  onFinishClick?(): void;
}

@observer
export class ConventionSideNavEditBtn extends Component<
  ConventionSideNavEditBtnProps
> {
  render(): JSX.Element {
    let {className, show, editMode, editLoading} = this.props;

    return (
      <Wrapper
        className={classNames('convention-side-nav-edit-btn', className)}
      >
        {editMode ? (
          <FinishButton onMouseDown={this.onInnerFinishClick}>
            <Button
              loading={editLoading}
              className="finish-button"
              icon="check"
            />
          </FinishButton>
        ) : (
          <EditButton
            className={show ? 'show' : 'hide'}
            onClick={this.onInnerClick}
            title="重命名"
          >
            <Icon type="edit" />
          </EditButton>
        )}
      </Wrapper>
    );
  }

  onInnerClick = (e: MouseEvent): void => {
    e.preventDefault();

    let {onClick} = this.props;

    if (onClick) {
      onClick();
    }
  };

  onInnerFinishClick = (e: MouseEvent): void => {
    e.preventDefault();

    let {onFinishClick} = this.props;

    if (onFinishClick) {
      onFinishClick();
    }
  };

  static Wrapper = Wrapper;
}
