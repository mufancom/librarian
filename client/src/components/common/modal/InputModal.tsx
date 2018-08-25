import {Button, Input, Modal} from 'antd';
import classNames from 'classnames';
import React, {Component, createRef} from 'react';

import {styled} from 'theme';
import {observer} from 'utils/mobx';

const Wrapper = styled.div``;

interface InputModalWithSecondInputProps {
  secondInput: true;
  onOkButtonClick?(value: string, secondValue: string): void;
}

interface InputModalWithoutSecondInputProps {
  secondInput?: false | undefined;
  onOkButtonClick?(value: string): void;
}

export type InputModalProps = {
  className?: string;
  visible: boolean;
  title: string;
  loading?: boolean;
  placeholder?: string;
  initialValue?: string;
  secondInputPlaceholder?: string;
  okButtonTitle?: string;
  cancelButtonTitle?: string;
  onCancelButtonClick?(): void;
} & (InputModalWithSecondInputProps | InputModalWithoutSecondInputProps);

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
      initialValue,
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
            <Input
              ref={this.inputRef}
              placeholder={placeholder}
              defaultValue={initialValue}
            />
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
    let value = this.inputRef.current!.input.value;

    let secondValue;

    if (this.props.onOkButtonClick) {
      if (this.props.secondInput) {
        secondValue = this.secondInputRef.current!.input.value;

        this.props.onOkButtonClick(value, secondValue);

        this.secondInputRef.current!.input.value = '';
      } else {
        this.props.onOkButtonClick(value);
      }
    }

    this.inputRef.current!.input.value = '';
  };

  static Wrapper = Wrapper;
}
