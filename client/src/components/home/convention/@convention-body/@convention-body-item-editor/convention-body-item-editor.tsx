import 'react-mde/lib/styles/css/react-mde-all.css';

import {Input} from 'antd';
import classNames from 'classnames';
import {action, observable} from 'mobx';
import React, {Component, createRef} from 'react';
import ReactDOM from 'react-dom';
import {Icon} from 'react-fa';
import ReactMde, {DraftUtil, ReactMdeTypes} from 'react-mde';

import {
  MarkdownState,
  MdeState,
  TextSelection,
} from 'react-mde/lib/definitions/types';
import {ConventionService} from 'services/convention-service';
import {Direction, ScrollService} from 'services/scroll-service';
import {styled} from 'theme';
import {mark} from 'utils/markdown';
import {inject, observer} from 'utils/mobx';

import {ResizeListener} from '../../../../common';

export function createCommitMessagePopover(
  inputRef: React.RefObject<Input>,
  onEnterKeyDown: () => void,
): JSX.Element {
  function onKeyDown(event: React.KeyboardEvent): void {
    if (event.which === 13) {
      onEnterKeyDown();
    }
  }

  return (
    <div>
      <Input placeholder="编辑说明" ref={inputRef} onKeyDown={onKeyDown} />
    </div>
  );
}

const Wrapper = styled.div`
  display: block;
  min-height: 300px;
  margin-bottom: 20px;

  @keyframes showTabLine {
    0% {
      opacity: 0;
      transform: scaleX(0);
    }
    85% {
      opacity: 1;
      transform: scaleX(1.15);
    }
    100% {
      opacity: 1;
      transform: scaleX(1);
    }
  }

  @keyframes showToolbar {
    0% {
      opacity: 0;
      transform: translateY(-50px);
    }
    100% {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes hideToolbar {
    0% {
      opacity: 0;
      transform: translateY(-50px);
    }
    100% {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .react-mde {
    top: 0;
    left: 0;
    right: 0;
    border: none;
    background-color: #fff;
    border-bottom: 1px solid #f2f2f2;

    .mde-header {
      border: none;

      ul.mde-header-group li.mde-header-item button {
        padding: 3px 4px;
      }
    }

    .react-mde-tabbed-layout {
      position: flex;
      .mde-tabs {
        .mde-tab {
          border: none;
          top: 0;
          padding: 11px;
          display: inline-block;

          &:hover {
            border: none;
          }

          &.mde-tab-activated {
            border: none;
            background-color: transparent;
          }

          &.mde-tab-activated::before {
            top: 30px;
            content: '';
            margin-left: auto;
            margin-right: auto;
            position: relative;
            display: block;
            width: 27px;
            height: 3px;
            background-color: ${props => props.theme.accent()};
            animation: showTabLine 0.2s ease-in-out;
          }
        }
      }
    }

    &.with-fixed-toolbar {
      .mde-header {
        box-shadow: 0 2px 4px rgba(57, 70, 78, 0.1);
        position: fixed;
        top: 90px;
        height: 44px;
        transition: all 0.3s;
        background-color: rgba(245, 245, 245, 0.96);
        z-index: 100;
      }

      &.pull-up {
        .mde-header {
          top: 0;
          transition: all 0.3s;
          animation: showToolbar 0.3s;
        }
      }

      .mde-text {
        margin-top: 44px;
      }
    }
  }
`;

export interface ConventionBodyItemEditorProps {
  className?: string;
  initialContent: string;
  onContentChange?(content: string): void;
  onSaveKeyDown?(): void;
}

export interface ConventionBodyItemEditorState {
  mdeState: ReactMdeTypes.MdeState;
}

@observer
export class ConventionBodyItemEditor extends Component<
  ConventionBodyItemEditorProps,
  ConventionBodyItemEditorState
> {
  @inject
  scrollService!: ScrollService;

  @inject
  conventionService!: ConventionService;

  @observable
  mdeState: ReactMdeTypes.MdeState;

  @observable
  fixedToolBar = false;

  @observable
  pullUp = false;

  wrapperRef: React.RefObject<any>;

  listenerId!: number;

  constructor(props: ConventionBodyItemEditorProps) {
    super(props);

    let {initialContent} = this.props;

    this.mdeState = {
      markdown: initialContent,
    };

    this.wrapperRef = createRef();
  }

  componentDidMount(): void {
    this.listenerId = this.scrollService.addListener(this.onWindowScroll);

    this.onWindowResize();
  }

  componentWillUnmount(): void {
    this.scrollService.removeListener(this.listenerId);
  }

  render(): JSX.Element {
    let {className} = this.props;

    return (
      <Wrapper
        ref={this.wrapperRef}
        className={classNames('convention-body-item-editor', className)}
        onKeyDown={this.onKeyDown}
      >
        <ResizeListener onResize={this.onWindowResize} />
        <ReactMde
          className={`react-mde ${
            this.fixedToolBar ? 'with-fixed-toolbar' : 'without-fixed-toolbar'
          }${this.pullUp ? ' pull-up' : ''}`}
          buttonContentOptions={{
            iconProvider: this.iconProvider,
          }}
          layout="tabbed"
          onChange={this.onMarkdownInputChange}
          editorState={this.mdeState}
          generateMarkdownPreview={this.generateMarkdownPreview}
        />
      </Wrapper>
    );
  }

  @action
  onMarkdownInputChange = (mdeState: ReactMdeTypes.MdeState): void => {
    let {onContentChange} = this.props;

    this.mdeState = mdeState;

    if (onContentChange) {
      onContentChange(mdeState.markdown!);
    }
  };

  @action
  onWindowScroll = (
    _top: number,
    direction: Direction,
    lastingLength: number,
  ): void => {
    let wrapperDiv = ReactDOM.findDOMNode(
      this.wrapperRef.current,
    ) as HTMLDivElement;

    if (direction === Direction.down && lastingLength > 100) {
      this.setPullUp(true);
    } else if (direction === Direction.up) {
      this.setPullUp(false);
    }

    let {top, bottom} = wrapperDiv.getBoundingClientRect();

    const headerHeight = 90;

    if (top < headerHeight && bottom > (this.pullUp ? 0 : headerHeight) + 50) {
      this.fixedToolBar = true;
    } else {
      this.fixedToolBar = false;
    }
  };

  @action
  setPullUp(pullUp: boolean): void {
    this.pullUp = pullUp;
  }

  onWindowResize = (): void => {
    let wrapperDiv = ReactDOM.findDOMNode(
      this.wrapperRef.current,
    ) as HTMLDivElement;

    let {width} = wrapperDiv.getBoundingClientRect();

    let headerDiv = wrapperDiv
      .getElementsByClassName('mde-header')
      .item(0) as HTMLDivElement;

    // tslint:disable-next-line:prefer-template
    headerDiv.style.width = width - 1 + 'px';
  };

  @action
  onKeyDown = async (event: React.KeyboardEvent): Promise<void> => {
    let keyCode = event.keyCode || event.which || event.charCode;
    let ctrlKey = event.ctrlKey || event.metaKey;

    if (ctrlKey && keyCode === 83) {
      event.preventDefault();

      await this.prettifyCodes();

      let {onSaveKeyDown} = this.props;

      if (onSaveKeyDown) {
        onSaveKeyDown();
      }
    }
  };

  generateMarkdownPreview = async (markdown: string): Promise<string> => {
    return mark(markdown).html;
  };

  @action
  prettifyCodes = async (): Promise<void> => {
    let mdeState = this.mdeState;

    let {draftEditorState} = mdeState;

    if (draftEditorState) {
      let selection = DraftUtil.getSelection(draftEditorState);

      let {formatted, cursorOffset} = await this.conventionService.prettify(
        mdeState.markdown!,
        selection.start,
      );

      let selectionLength = selection.end - selection.start;

      selection.start = cursorOffset;

      selection.end = selection.start + selectionLength;

      if (selection.end > formatted.length) {
        selection.end = formatted.length;
      }

      let newMarkdownState: MarkdownState = {
        text: formatted,
        selection,
      };

      let newEditorState = DraftUtil.buildNewDraftState(
        draftEditorState,
        newMarkdownState,
      );

      let newMdeState: MdeState = {
        markdown: formatted,
        draftEditorState: newEditorState,
      };

      this.mdeState = newMdeState;
    }
  };

  setContent(content: string): void {
    let mdeState = this.mdeState;

    let {draftEditorState} = mdeState;

    if (draftEditorState) {
      let selection: TextSelection = {
        start: content.length,
        end: content.length,
      };

      let newMarkdownState: MarkdownState = {
        text: content,
        selection,
      };

      let newEditorState = DraftUtil.buildNewDraftState(
        draftEditorState,
        newMarkdownState,
      );

      let newMdeState: MdeState = {
        markdown: content,
        draftEditorState: newEditorState,
      };

      this.mdeState = newMdeState;
    }
  }

  iconProvider = (name: string): React.ReactNode => {
    switch (name) {
      case 'heading':
        name = 'header';
        break;
    }
    return <Icon name={name} />;
  };

  static Wrapper = Wrapper;
}
