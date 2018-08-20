import {Button} from 'antd';
import classNames from 'classnames';
import {action, observable} from 'mobx';
import React, {Component} from 'react';

import {ConventionService} from 'services/convention-service';
import {ConventionStore} from 'stores/convention-store';
import {styled} from 'theme';
import {prettify} from 'utils/markdown';
import {inject, observer} from 'utils/mobx';

import {ConventionBodyItemEditor} from './@convention-body-item-editor';
import {ConventionBodyItemDraftHint} from './@convention-body-item-editor/convention-body-item-draft-hint';

const AUTO_SAVE_INTERVAL = 10000;

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
  @inject
  conventionStore!: ConventionStore;

  @inject
  conventionService!: ConventionService;

  @observable
  content: string = '';

  @observable
  initialContent: string = '';

  editorKey = 0;

  authSaveTimer: any;

  componentWillUnmount(): void {
    if (this.authSaveTimer) {
      clearTimeout(this.authSaveTimer);
    }
  }

  render(): JSX.Element {
    let {className, onCancelClick, show, loading} = this.props;

    let {newItemDraft} = this.conventionStore;

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
                {newItemDraft ? (
                  <ConventionBodyItemDraftHint
                    savedAt={newItemDraft.savedAt}
                    restoreOnclick={this.onRestoreButtonClick}
                  />
                ) : (
                  undefined
                )}

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
              key={this.editorKey}
              initialContent={this.initialContent}
              onContentChange={this.onContentChange}
              onSaveKeyDown={this.onSaveKeyDown}
            />
          </div>
        ) : (
          undefined
        )}
      </Wrapper>
    );
  }

  @action
  onContentChange = (content: string): void => {
    this.content = content;

    if (this.content.length !== 0) {
      if (this.authSaveTimer) {
        clearTimeout(this.authSaveTimer);
      }

      this.authSaveTimer = setTimeout(this.onAutoSave, AUTO_SAVE_INTERVAL);
    }
  };

  @action
  onRestoreButtonClick = (): void => {
    let {newItemDraft} = this.conventionStore;

    if (newItemDraft) {
      this.setContent(newItemDraft.content);
    }
  };

  @action
  setContent(content: string): void {
    this.initialContent = content;

    this.editorKey++;
  }

  onInnerOkClick = (): void => {
    let {onOkClick} = this.props;

    if (onOkClick) {
      onOkClick(this.content);
    }
  };

  onSaveKeyDown = (): void => {
    this.setContent(prettify(this.content));
  };

  onAutoSave = (): void => {
    this.save();
  };

  save = (): void => {
    this.conventionService.saveNewConventionItemDraft(this.content);
  };

  static Wrapper = Wrapper;
}
