import {Icon} from 'antd';
import classNames from 'classnames';
import React, {Component} from 'react';

import {styled} from 'theme';
import {observer} from 'utils/mobx';

const Wrapper = styled.div`
  transform: scale(0.9);
  transition: all 0.3s;

  &:hover {
    transform: scale(1);
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
`;

const DownShiftButton = styled(ShiftButton)`
  padding-bottom: 1px;
`;

export interface ConventionBodyItemShiftButtonProps {
  className?: string;
  upOnclick?(): void;
  downOnclick?(): void;
}

@observer
export class ConventionBodyItemShiftButton extends Component<
  ConventionBodyItemShiftButtonProps
> {
  render(): JSX.Element {
    let {className, upOnclick, downOnclick} = this.props;

    return (
      <Wrapper
        className={classNames('convention-body-item-shift-button', className)}
      >
        <UpShiftButton onClick={upOnclick} title="上移">
          <Icon type="up" />
        </UpShiftButton>
        <DownShiftButton onClick={downOnclick} title="下移">
          <Icon type="down" />
        </DownShiftButton>
      </Wrapper>
    );
  }

  static Wrapper = Wrapper;
}
