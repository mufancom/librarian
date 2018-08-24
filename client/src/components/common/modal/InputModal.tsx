import {Button, Input, Modal} from 'antd';
import classNames from 'classnames';
import React, {Component, createRef} from 'react';

import {styled} from 'theme';
import {observer} from 'utils/mobx';

const Wrapper = styled.div``;

export interface InputModalProps {
  className?: string;
  visible: boolean;
  title: string;
  loading?: boolean;
  placeholder?: string;
  secondInput?: boolean;
  secondInputPlaceholder?: string;
  okButtonTitle?: string;
  cancelButtonTitle?: string;
  onOkButtonClick?(value: string, secondValue: string): void;
  onCancelButtonClick?(): void;
}

@observer
export class InputModal extends Component<InputModalProps> {
  inputRef: React.RefObject<Input> = createRef();
  secondInputRef: React.RefObject<Input> = createRef();

  render(): JSX.Element {
    let {
      className,
      title,
      visible,
      onCancelButtonClick,
      loading,
      placeholder,
      secondInput,
      secondInputPlaceholder,
      cancelButtonTitle,
      okButtonTitle,
    } = this.props;

    return (
      <Wrapper className={classNames('InputModal', className)}>
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
            <Input ref={this.inputRef} placeholder={placeholder} />
          </p>
          {secondInput ? (
            <p>
              <Input
                ref={this.secondInputRef}
                placeholder={secondInputPlaceholder}
              />
            </p>
          ) : (
            undefined
          )}
        </Modal>
      </Wrapper>
    );
  }

  onOkClick = (): void => {
    let {onOkButtonClick} = this.props;
    let value = this.inputRef.current!.input.value;
    let secondValue = this.secondInputRef.current!.input.value;

    if (onOkButtonClick) {
      onOkButtonClick(value, secondValue);
    }

    this.inputRef.current!.input.value = '';
    this.secondInputRef.current!.input.value = '';
  };

  static Wrapper = Wrapper;
}
