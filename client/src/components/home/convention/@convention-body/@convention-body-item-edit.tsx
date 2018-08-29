import {Button} from 'antd';
import classNames from 'classnames';
import {action, observable} from 'mobx';
import React, {Component, createRef} from 'react';

import {ConventionService} from 'services/convention-service';
import {ConventionItem, ItemDraft} from 'stores/convention-store';
import {styled} from 'theme';
import {inject, observer} from 'utils/mobx';
import {getMarkdownTitle} from 'utils/regex';

import {ConventionBodyItemEditor} from './@convention-body-item-editor';
import {ConventionBodyItemDraftHint} from './@convention-body-item-editor/convention-body-item-draft-hint';

const AUTO_SAVE_INTERVAL = 10000;

const Wrapper = styled.div`
  ${ConventionBodyItemEditor.Wrapper} {
    margin-top: 10px;
  }
`;

const EditConventionHead = styled.div`
  font-size: 20px;
  position: relative;
  top: -5px;
  z-index: 120;
  background-color: #fff;
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
  @inject
  conventionService!: ConventionService;

  @observable
  content = this.props.item.content;

  @observable
  titleHint = getMarkdownTitle(this.props.item.content, '编辑条目');

  @observable
  okButtonDisabled = true;

  fromVersionId = this.props.item.versionId;

  editorRef: React.RefObject<any> = createRef();

  autoSaveTimer: any;

  autoSaveLastTime = 0;

  componentWillUnmount(): void {
    if (this.autoSaveTimer) {
      clearTimeout(this.autoSaveTimer);
    }
  }

  render(): JSX.Element {
    let {className, loading, item, onCancelOnclick} = this.props;

    let itemDraft = this.getCurrentDraft();

    return (
      <Wrapper className={classNames('convention-body-item-edit', className)}>
        <EditConventionHead>
          {this.titleHint}
          &nbsp;
          <EditConventionHeadOperations>
            {itemDraft ? (
              <ConventionBodyItemDraftHint
                savedAt={itemDraft.savedAt}
                restoreOnclick={this.onRestoreButtonClick}
              />
            ) : (
              undefined
            )}
            <Button style={{marginRight: '10px'}} onClick={onCancelOnclick}>
              取消
            </Button>
            <Button
              loading={loading}
              type="primary"
              onClick={this.onInnerOkClick}
              disabled={this.okButtonDisabled}
            >
              完成
            </Button>
          </EditConventionHeadOperations>
        </EditConventionHead>
        <ConventionBodyItemEditor
          ref={this.editorRef}
          onSaveKeyDown={this.onSaveKeyDown}
          initialContent={item.content}
          onContentChange={this.onContentChange}
        />
      </Wrapper>
    );
  }

  @action
  onContentChange = (content: string): void => {
    this.content = content;

    this.okButtonDisabled = content === this.props.item.content;

    this.titleHint = getMarkdownTitle(content, '编辑条目');

    if (this.content.length !== 0) {
      if (this.autoSaveTimer) {
        clearTimeout(this.autoSaveTimer);
      }

      this.autoSaveTimer = setTimeout(this.onAutoSave, 1000);
    }
  };

  onInnerOkClick = (): void => {
    let {onOkClick} = this.props;

    if (onOkClick) {
      onOkClick(this.content, this.fromVersionId);
    }
  };

  onAutoSave = (): void => {
    let now = Date.now();

    if (
      this.autoSaveLastTime !== 0 &&
      now - this.autoSaveLastTime > AUTO_SAVE_INTERVAL
    ) {
      this.save();
      this.autoSaveLastTime = now;
    }
  };

  @action
  onRestoreButtonClick = (): void => {
    let newItemDraft = this.getCurrentDraft();

    if (newItemDraft) {
      this.setContent(newItemDraft.content);
    }
  };

  @action
  setContent(content: string): void {
    let editorInjector = this.editorRef.current;

    if (editorInjector) {
      let editor = editorInjector.wrappedInstance as ConventionBodyItemEditor;

      editor.setContent(content);
    }
  }

  onSaveKeyDown = (): void => {
    this.save();
  };

  getCurrentDraft = (): ItemDraft | undefined => {
    let {item} = this.props;

    return this.conventionService.getEditConventionItemDraft(item.id);
  };

  save = (): void => {
    let {item} = this.props;

    this.conventionService.saveEditConventionItemDraft(item.id, this.content);

    this.forceUpdate();
  };

  static Wrapper = Wrapper;
}
