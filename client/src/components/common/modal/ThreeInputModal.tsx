import {Button, Input, Modal} from 'antd';
import classNames from 'classnames';
import React, {Component, createRef} from 'react';

import {styled} from 'theme';
import {observer} from 'utils/mobx';

const Wrapper = styled.div``;

export interface ThreeInputModalProps {
  className?: string;
  visible: boolean;
  title: string;
  loading?: boolean;
  firstPlaceholder?: string;
  firstInitialValue?: string;
  firstType?: string;
  secondPlaceholder?: string;
  secondInitialValue?: string;
  secondType?: string;
  thirdPlaceholder?: string;
  thirdInitialValue?: string;
  thirdType?: string;
  okButtonTitle?: string;
  cancelButtonTitle?: string;
  onOkButtonClick?(
    firstValue: string,
    secondValue: string,
    thirdValue: string,
  ): void;
  onCancelButtonClick?(): void;
}

@observer
export class ThreeInputModal extends Component<ThreeInputModalProps> {
  firstInputRef: React.RefObject<Input> = createRef();

  secondInputRef: React.RefObject<Input> = createRef();

  thirdInputRef: React.RefObject<Input> = createRef();

  render(): JSX.Element {
    let {
      className,
      visible,
      title,
      onCancelButtonClick,
      cancelButtonTitle,
      okButtonTitle,
      loading,
      firstPlaceholder,
      firstInitialValue,
      firstType,
      secondPlaceholder,
      secondInitialValue,
      secondType,
      thirdPlaceholder,
      thirdInitialValue,
      thirdType,
    } = this.props;

    return (
      <Wrapper className={classNames('ThreeInputModal', className)}>
        <Modal
          visible={visible}
          title={title}
          onOk={this.onOkClick}
          width="300px"
          onCancel={onCancelButtonClick}
          footer={[
            <Button key="back" onClick={onCancelButtonClick}>
              {cancelButtonTitle ? cancelButtonTitle : '取消'}
            </Button>,
            <Button
              key="submit"
              type="primary"
              loading={loading}
              onClick={this.onOkClick}
            >
              {okButtonTitle ? okButtonTitle : '确定'}
            </Button>,
          ]}
        >
          <p>
            <Input
              type={firstType ? firstType : undefined}
              ref={this.firstInputRef}
              placeholder={firstPlaceholder}
              defaultValue={firstInitialValue}
            />
          </p>
          <p>
            <Input
              type={secondType ? secondType : undefined}
              ref={this.secondInputRef}
              placeholder={secondPlaceholder}
              defaultValue={secondInitialValue}
            />
          </p>
          <p>
            <Input
              type={thirdType ? thirdType : undefined}
              ref={this.thirdInputRef}
              placeholder={thirdPlaceholder}
              defaultValue={thirdInitialValue}
            />
          </p>
        </Modal>
      </Wrapper>
    );
  }

  onOkClick = (): void => {
    let firstValue = this.firstInputRef.current!.input.value;
    let secondValue = this.secondInputRef.current!.input.value;
    let thirdValue = this.thirdInputRef.current!.input.value;

    let {onOkButtonClick} = this.props;

    if (onOkButtonClick) {
      onOkButtonClick(firstValue, secondValue, thirdValue);
    }
  };

  static Wrapper = Wrapper;
}
