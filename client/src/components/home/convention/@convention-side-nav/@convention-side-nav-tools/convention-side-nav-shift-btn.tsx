import {Icon} from 'antd';
import classNames from 'classnames';
import React, {Component} from 'react';

import {styled} from 'theme';
import {observer} from 'utils/mobx';

const Wrapper = styled.div`
  transform: scale(0.8);
  transition: all 0.3s;

  &:hover {
    transform: scale(0.9);
    transition: all 0.3s;
  }
`;

const ShiftButton = styled.a`
  text-decoration: none;
  display: block;
  border: 1px solid transparent;
  padding: 0 2px;
  transition: all 0.3s;
  line-height: 8px;
  font-size: 8px;
  color: ${props => props.theme.text.placeholder} !important;

  &:hover {
    color: ${props => props.theme.accent()} !important;
    border-radius: 2px;
    transform: scale(1.3);
    border: 1px solid ${props => props.theme.border.light};
    transition: all 0.3s;
  }

  &.active {
    color: ${props => props.theme.accent()} !important;
    transition: all 0.3s;
  }
`;

const UpShiftButton = styled(ShiftButton)`
  padding-top: 1px;

  @keyframes show {
    0% {
      transform: translateY(-10px);
      opacity: 0;
    }
    100% {
      transform: translateY(0);
      opacity: 1;
    }
  }

  @keyframes hide {
    0% {
      transform: translateY(0);
      opacity: 1;
    }
    100% {
      transform: translateY(-10px);
      opacity: 0;
    }
  }

  &.show {
    opacity: 1;
    animation: show 0.3s;
  }

  &.hide {
    opacity: 0;
    animation: hide 0.3s;
    visible: hidden;
  }
`;

const DownShiftButton = styled(ShiftButton)`
  padding-bottom: 1px;

  @keyframes showDownShiftButton {
    0% {
      transform: translateY(+10px);
      opacity: 0;
    }
    100% {
      transform: translateY(0);
      opacity: 1;
    }
  }

  @keyframes hideDownShiftButton {
    0% {
      transform: translateY(0);
      opacity: 1;
    }
    100% {
      transform: translateY(+10px);
      opacity: 0;
    }
  }

  &.show {
    opacity: 1;
    animation: showDownShiftButton 0.3s;
  }

  &.hide {
    opacity: 0;
    animation: hideDownShiftButton 0.3s;
    visible: hidden;
    position: absolute;
    top: -999999px;
  }
`;

export interface ConventionSideNavShiftBtnProps {
  className?: string;
  show: boolean;
  upOnclick?(): void;
  downOnclick?(): void;
}

@observer
export class ConventionSideNavShiftBtn extends Component<
  ConventionSideNavShiftBtnProps
> {
  render(): JSX.Element {
    let {className, show, upOnclick, downOnclick} = this.props;

    return (
      <Wrapper
        className={classNames('convention-side-nav-shift-btn', className)}
      >
        <UpShiftButton
          className={show ? 'show' : 'hide'}
          onClick={upOnclick}
          title="上移"
        >
          <Icon type="up" />
        </UpShiftButton>
        <DownShiftButton
          className={show ? 'show' : 'hide'}
          onClick={downOnclick}
          title="下移"
        >
          <Icon type="down" />
        </DownShiftButton>
      </Wrapper>
    );
  }

  static Wrapper = Wrapper;
}
