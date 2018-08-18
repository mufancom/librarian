import classNames from 'classnames';
import {action} from 'mobx';
import React, {Component, createRef} from 'react';
import ReactDOM from 'react-dom';

import {styled} from 'theme';
import {observer} from 'utils/mobx';
import {filterHTMLTags} from 'utils/regex';

const Wrapper = styled.div`
  display: inline;

  &.rename-mode {
    cursor: text;
    outline: none;
  }
`;

export type CancelBlocker = () => void;

export interface ConventionSideNavEditableTitleProps {
  className?: string;
  renameMode: boolean;
  title: string;
  setRenameMode?(renameMode: boolean): void;
  getRenameModeCancelBlocker?(blocker: CancelBlocker): void;
  onChange?(value: string): void;
  onFinish?(): void;
  onCancel?(): void;
}

@observer
export class ConventionSideNavEditableTitle extends Component<
  ConventionSideNavEditableTitleProps
> {
  titleRef: React.RefObject<any> = createRef();

  renameBlurTimer: any;

  updateKey: number = 0;

  constructor(props: ConventionSideNavEditableTitleProps) {
    super(props);

    let {getRenameModeCancelBlocker} = this.props;

    if (getRenameModeCancelBlocker) {
      getRenameModeCancelBlocker(this.blockCancel);
    }
  }

  blockCancel() {
    if (this.renameBlurTimer) {
      clearTimeout(this.renameBlurTimer);
    }
  }

  render() {
    let {className, renameMode, title} = this.props;

    return (
      <Wrapper
        className={classNames(
          'convention-side-nav-editable-title',
          className,
          renameMode ? 'rename-mode' : undefined,
        )}
        contentEditable={renameMode}
        onClick={this.onTitleClick}
        onBlur={this.onTitleBlur}
        onKeyDown={this.onTitleKeyDown}
        onInput={this.onTitleChange}
        ref={this.titleRef}
        key={this.updateKey}
        dangerouslySetInnerHTML={{__html: filterHTMLTags(title)}}
      />
    );
  }

  onTitleKeyDown = (event: React.KeyboardEvent) => {
    let {onFinish} = this.props;

    if (event.which === 13) {
      event.preventDefault();

      if (onFinish) {
        onFinish();
      }
    } else if (event.which === 27) {
      this.cancel();
    }
  };

  onTitleClick = (e: React.MouseEvent) => {
    let {renameMode} = this.props;

    if (renameMode) {
      e.preventDefault();
    }
  };

  @action
  onTitleBlur = () => {
    let {renameMode} = this.props;

    this.renameBlurTimer = setTimeout(() => {
      if (renameMode) {
        this.cancel();
      }
    }, 100);
  };

  @action
  cancel = () => {
    let {setRenameMode, onCancel} = this.props;

    if (setRenameMode) {
      setRenameMode(false);
    }

    this.updateKey += 1;

    if (onCancel) {
      onCancel();
    }
  };

  onTitleChange = () => {
    let {onChange} = this.props;

    let titleDom = ReactDOM.findDOMNode(
      this.titleRef.current,
    ) as HTMLDivElement;

    let title = '';

    if (titleDom.firstChild) {
      title = filterHTMLTags(titleDom.firstChild.nodeValue!.trim());
    }

    if (onChange) {
      onChange(title);
    }
  };

  static Wrapper = Wrapper;
}
