import {Button} from 'antd';
import classNames from 'classnames';
import {action, observable} from 'mobx';
import React, {Component} from 'react';

import {ConventionItem} from 'stores/convention-store';
import {styled} from 'theme';
import {observer} from 'utils/mobx';
import {ConventionBodyItemEditor} from './@convention-body-item-editor';

const Wrapper = styled.div``;

const EditConventionHead = styled.div`
  font-size: 20px;
  position: relative;
`;

const EditConventionHeadOperations = styled.div`
  float: right;
  margin-right: 3px;
`;

export interface ConventionBodyItemEditProps {
  className?: string;
  loading?: boolean;
  item: ConventionItem;
  onCancelOnclick?(): void;
  onOkClick?(content: string, fromVersionId: number): void;
}

@observer
export class ConventionBodyItemEdit extends Component<
  ConventionBodyItemEditProps
> {
  @observable
  content = this.props.item.content;

  fromVersionId = this.props.item.versionId;

  render() {
    let {className, loading, item, onCancelOnclick} = this.props;

    return (
      <Wrapper className={classNames('convention-body-item-edit', className)}>
        <EditConventionHead>
          <EditConventionHeadOperations>
            <Button style={{marginRight: '10px'}} onClick={onCancelOnclick}>
              取消
            </Button>
            <Button
              loading={loading}
              type="primary"
              onClick={this.onInnerOkClick}
            >
              完成
            </Button>
          </EditConventionHeadOperations>
        </EditConventionHead>
        <ConventionBodyItemEditor
          initialContent={item.content}
          onContentChange={this.onContentChange}
        />
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
      onOkClick(this.content, this.fromVersionId);
    }
  };

  static Wrapper = Wrapper;
}
