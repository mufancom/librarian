import {Button} from 'antd';
import classNames from 'classnames';
import React, {Component} from 'react';

import {styled} from 'theme';
import {observer} from 'utils/mobx';

const Wrapper = styled.div`
  @keyframes addItemBtnShowUp {
    0% {
      opacity: 0;
      transform: scale(0);
    }

    100% {
      opacity: 1;
      transform: scale(1);
    }
  }

  @keyframes addItemBtnHide {
    0% {
      opacity: 1;
      transform: scale(1);
    }

    100% {
      opacity: 0;
      transform: scale(0);
    }
  }

  @keyframes addItemBtnWrapperScaleUp {
    0% {
      height: 0;
    }

    100% {
      height: 24px;
    }
  }

  @keyframes addItemBtnWrapperScaleDown {
    0% {
      height: 24px;
    }

    100% {
      height: 0;
    }
  }

  .add-item-button-wrapper {
    height: 24px;
    width: 1px;
    display: block;

    &.with-edit {
      animation: addItemBtnWrapperScaleUp 0.3s ease-in-out;

      .add-item-button {
        animation: addItemBtnShowUp 0.3s ease-in-out;
        display: block;
      }
    }

    &.without-edit {
      animation: addItemBtnWrapperScaleDown 0.3s ease-in-out;
      height: 0;

      .add-item-button {
        animation: addItemBtnHide 0.3s ease-in-out;
        visible: hidden;
        opacity: 0;
        pointer-events: none;
      }
    }

    .add-item-button {
      margin-top: 8px;
      padding: 0 4px !important;
      position: absolute;

      &.with-title {
        color: #bbb;
        border: none;
        margin-left: -6px;
        margin-top: 4px;
        margin-bottom: 4px;
        font-size: 13px;

        &:hover,
        &:active {
          color: #40a9ff;
        }
      }
    }
  }
`;

const ButtonTitle = styled.span`
  position: relative;
  margin-left: -5px;
`;

export interface ConventionSideNavAddBtnProps {
  className?: string;
  show: boolean;
  title?: string;
  onClick?(): void;
}

@observer
export class ConventionSideNavAddBtn extends Component<
  ConventionSideNavAddBtnProps
> {
  render(): JSX.Element {
    let {className, show, onClick, title} = this.props;

    return (
      <Wrapper className={classNames('convention-side-nav-add-btn', className)}>
        <div
          className={`add-item-button-wrapper ${
            show ? 'with-edit' : 'without-edit'
          }`}
        >
          <Button
            onClick={onClick}
            className={`add-item-button ${
              title ? 'with-title' : 'without-title'
            }`}
            size="small"
            icon="plus"
            type="dashed"
          >
            {title ? <ButtonTitle>{title}</ButtonTitle> : undefined}
          </Button>
        </div>
      </Wrapper>
    );
  }

  static Wrapper = Wrapper;
}
