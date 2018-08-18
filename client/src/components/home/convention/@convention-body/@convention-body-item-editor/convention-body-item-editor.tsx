import classNames from 'classnames';
import {action, observable} from 'mobx';
import React, {Component, createRef} from 'react';
import ReactDOM from 'react-dom';
import {Icon} from 'react-fa';
import ReactMde, {ReactMdeTypes} from 'react-mde';
import 'react-mde/lib/styles/css/react-mde-all.css';

import {ScrollService} from 'services/scroll-service';
import {styled} from 'theme';
import {mark} from 'utils/markdown';
import {inject, observer} from 'utils/mobx';

import {ResizeListener} from '../../../../common';

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

    &.without-fixed-toolbar {
      .mde-header {
        animation: hideToolbar 0.3s ease-in-out;
      }
    }

    &.with-fixed-toolbar {
      .mde-header {
        box-shadow: 0 2px 4px rgba(57, 70, 78, 0.1);
        position: fixed;
        top: 90px;
        height: 44px;
        animation: showToolbar 0.3s ease-in-out;
        background-color: rgba(245, 245, 245, 0.96);
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

  @observable
  mdeState: ReactMdeTypes.MdeState;

  @observable
  fixedToolBar: boolean = false;

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
      >
        <ResizeListener onResize={this.onWindowResize} />
        <ReactMde
          className={`react-mde ${
            this.fixedToolBar ? 'with-fixed-toolbar' : 'without-fixed-toolbar'
          }`}
          buttonContentOptions={{
            iconProvider: this.iconProvider,
          }}
          layout="tabbed"
          onChange={this.onMarkdownInputChange}
          editorState={this.mdeState}
          generateMarkdownPreview={markdown => Promise.resolve(mark(markdown))}
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
  onWindowScroll = (_top: number): void => {
    let wrapperDiv = ReactDOM.findDOMNode(
      this.wrapperRef.current,
    ) as HTMLDivElement;

    let {top, bottom} = wrapperDiv.getBoundingClientRect();

    if (top < 90 && bottom > 90 + 50) {
      this.fixedToolBar = true;
    } else {
      this.fixedToolBar = false;
    }
  };

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
