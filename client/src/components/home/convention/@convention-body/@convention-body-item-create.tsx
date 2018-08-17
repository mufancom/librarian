import {Button} from 'antd';
import classNames from 'classnames';
import {action, observable} from 'mobx';
import React, {Component} from 'react';

import {styled} from 'theme';
import {observer} from 'utils/mobx';
import {ConventionBodyItemEditor} from './@convention-body-item-editor';

const Wrapper = styled.div`
  position: relative;
  height: 550px;

  ${ConventionBodyItemEditor.Wrapper} {
    position: absolute;
    z-index: 500;
    left: 0;
    right: 0;
    top: 46px;
    bottom: 0;
  }
`;

const AddConventionHead = styled.div`
  font-size: 20px;
  position: relative;
`;

const AddConventionHeadOperations = styled.div`
  float: right;
  margin-right: 3px;
`;

export interface ConventionBodyItemCreateProps {
  className?: string;
  show: boolean;
  loading?: boolean;
  onCancelClick?(): void;
  onOkClick?(content: string): void;
}

@observer
export class ConventionBodyItemCreate extends Component<
  ConventionBodyItemCreateProps
> {
  @observable
  content: string = '';

  render() {
    let {className, onCancelClick, show, loading} = this.props;

    return (
      <Wrapper
        className={classNames('convention-body-item-create', className)}
        style={{display: show ? 'block' : 'none'}}
      >
        {show ? (
          <div>
            <AddConventionHead>
              添加条目
              <AddConventionHeadOperations>
                <Button style={{marginRight: '10px'}} onClick={onCancelClick}>
                  取消
                </Button>
                <Button
                  loading={loading}
                  type="primary"
                  onClick={this.onInnerOkClick}
                >
                  完成
                </Button>
              </AddConventionHeadOperations>
            </AddConventionHead>
            <ConventionBodyItemEditor
              initialContent=""
              onContentChange={this.onContentChange}
            />
          </div>
        ) : (
          undefined
        )}
      </Wrapper>
    );
  }

  @action
  onContentChange = (content: string) => {
    this.content = content;
  };

  onInnerOkClick = () => {
    let {onOkClick} = this.props;

    if (onOkClick) {
      onOkClick(this.content);
    }
  };

  static Wrapper = Wrapper;
}
