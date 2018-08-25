import {message} from 'antd';
import classNames from 'classnames';
import {action, computed, observable} from 'mobx';
import React, {Component, createRef} from 'react';
import ReactDOM from 'react-dom';
import {NavLink, RouteComponentProps, withRouter} from 'react-router-dom';

import {fetchErrorMessage} from 'services/api-service';
import {ConventionService} from 'services/convention-service';
import {AuthStore} from 'stores/auth-store';
import {ConventionIndexConventionNode} from 'stores/convention-store';
import {styled} from 'theme';
import {collapseToEnd} from 'utils/dom';
import {inject, observer} from 'utils/mobx';

import {InputModal} from '../../../common';

import {
  CancelBlocker,
  ConventionSideNavDeleteBtn,
  ConventionSideNavEditBtn,
  ConventionSideNavEditableTitle,
} from './@convention-side-nav-tools';
import {ConventionSideNavShiftBtn} from './@convention-side-nav-tools/convention-side-nav-shift-btn';

const Wrapper = styled.li`
  color: ${props => props.theme.text.navRegular};
  position: relative;
  font-size: 14px;
  font-weight: 400;
  padding-top: 8px;
  padding-bottom: 8px;
  list-style-type: none;
  display: block;
  transition: all 0.3s;

  &.shift-loading {
    opacity: 0.5;
    transition: all 0.3s;
  }

  a {
    color: ${props => props.theme.text.navRegular};
    text-decoration: none;
    display: block;

    &:hover {
      color: ${props => props.theme.accent()};
    }

    &.active {
      color: ${props => props.theme.accent()};
    }
  }

  & > ${ConventionSideNavShiftBtn.Wrapper} {
    position: absolute;
    right: 20px;
    top: 8px;
  }

  ${ConventionSideNavEditableTitle.Wrapper} {
    &.rename-mode {
      color: ${props => props.theme.text.regular};
    }
  }
`;

export interface ConventionSideNavItemProps extends RouteComponentProps<any> {
  className?: string;
  node: ConventionIndexConventionNode;
}

@observer
export class ConventionSideNavItem extends Component<
  ConventionSideNavItemProps
> {
  @inject
  authStore!: AuthStore;

  @inject
  conventionService!: ConventionService;

  @observable
  mouseMoveIn = false;

  @observable
  renameMode = false;

  @observable
  renameLoading = false;

  @observable
  itemTitle = this.props.node.entry.title;

  @observable
  shiftLoading = false;

  @observable
  aliasInputModalVisible = false;

  @observable
  aliasInputModalInitialValue: string | undefined;

  @observable
  aliasInputModalLoading = false;

  renameCancelBlocker?: CancelBlocker;

  renameBlurTimer: any;

  itemTitleRef: React.RefObject<any> = createRef();

  @computed
  get showButtons(): boolean {
    return this.mouseMoveIn && this.authStore.isLoggedIn && !this.shiftLoading;
  }

  render(): JSX.Element {
    let {
      className,
      node: {entry, url},
    } = this.props;

    return (
      <Wrapper
        className={classNames(
          'convention-side-nav-item',
          className,
          this.shiftLoading ? 'shift-loading' : undefined,
        )}
        onMouseEnter={this.onMouseEnter}
        onMouseLeave={this.onMouseLeave}
      >
        <InputModal
          title="修改别名"
          placeholder="请输入新的别名"
          visible={this.aliasInputModalVisible}
          initialValue={this.aliasInputModalInitialValue}
          onOkButtonClick={this.aliasInputModalOnclick}
          onCancelButtonClick={this.aliasInputModalCancelButtonOnclick}
          loading={this.aliasInputModalLoading}
        />
        <NavLink to={`/convention/${url ? url : entry.id}`}>
          <ConventionSideNavEditableTitle
            renameMode={this.renameMode}
            setRenameMode={this.setRenameMode}
            getRenameModeCancelBlocker={this.setUpRenameModeCancelBlocker}
            onChange={this.onTitleChange}
            onFinish={this.onRenameFinishButtonClick}
            title={entry.title}
            ref={this.itemTitleRef}
          />
          <ConventionSideNavEditBtn
            show={this.showButtons}
            editMode={this.renameMode}
            editLoading={this.renameLoading}
            onClick={this.onRenameButtonClick}
            onFinishClick={this.onRenameFinishButtonClick}
            onAliasEditClick={this.onAliasEditClick}
          />
          <ConventionSideNavDeleteBtn
            show={this.showButtons && !this.renameMode}
            onClick={this.onDeleteButtonClick}
          />
        </NavLink>
        <ConventionSideNavShiftBtn
          show={this.showButtons && !this.renameMode}
          upOnclick={this.onUpShiftButtonOnclick}
          downOnclick={this.onDownShiftButtonOnclick}
        />
      </Wrapper>
    );
  }

  @action
  onMouseEnter = (): void => {
    this.mouseMoveIn = true;
  };

  @action
  onMouseLeave = (): void => {
    this.mouseMoveIn = false;
  };

  @action
  setRenameMode = (renameMode: boolean): void => {
    this.renameMode = renameMode;
  };

  setUpRenameModeCancelBlocker = (blocker: CancelBlocker): void => {
    this.renameCancelBlocker = blocker;
  };

  onTitleChange = (value: string): void => {
    this.itemTitle = value;
  };

  setTitleOnFocus(): void {
    let titleDom = ReactDOM.findDOMNode(
      this.itemTitleRef.current,
    ) as HTMLDivElement;

    titleDom.focus();

    collapseToEnd(titleDom);
  }

  @action
  onRenameButtonClick = (): void => {
    this.renameMode = true;

    setTimeout(() => {
      this.setTitleOnFocus();
    }, 100);
  };

  @action
  onRenameFinishButtonClick = async (): Promise<void> => {
    if (this.renameCancelBlocker) {
      this.renameCancelBlocker();
    }

    this.renameLoading = true;

    let {
      node: {entry},
    } = this.props;

    try {
      await this.conventionService.renameConvention(entry.id, this.itemTitle);

      this.renameMode = false;
    } catch (error) {
      let errorMessage = fetchErrorMessage(error);

      message.error(errorMessage);
    }

    this.renameLoading = false;
  };

  @action
  onAliasEditClick = (): void => {
    let {alias} = this.props.node.entry;

    this.aliasInputModalInitialValue = alias;

    this.aliasInputModalVisible = true;
  };

  @action
  aliasInputModalOnclick = async (value: string): Promise<void> => {
    this.aliasInputModalLoading = true;

    let {id} = this.props.node.entry;

    try {
      await this.conventionService.editConventionAlias(id, value);

      message.success('别名修改成功');

      this.aliasInputModalVisible = false;
    } catch (error) {
      let errorMessage = fetchErrorMessage(error);

      message.error(errorMessage);
    }

    this.aliasInputModalLoading = false;
  };

  @action
  aliasInputModalCancelButtonOnclick = (): void => {
    this.aliasInputModalVisible = false;
  };

  onDeleteButtonClick = async (): Promise<void> => {
    let {
      node: {entry},
    } = this.props;

    try {
      await this.conventionService.deleteConvention(entry.id);
    } catch (error) {
      let errorMessage = fetchErrorMessage(error);

      message.error(errorMessage);
    }
  };

  onUpShiftButtonOnclick = async (): Promise<void> => {
    await this.shiftConvention(-2);
  };

  onDownShiftButtonOnclick = async (): Promise<void> => {
    await this.shiftConvention(1);
  };

  @action
  async shiftConvention(offset: number): Promise<void> {
    this.shiftLoading = true;

    let {
      node: {
        entry: {id, orderId},
      },
    } = this.props;

    try {
      await this.conventionService.shiftConvention(id, orderId + offset);
    } catch (error) {
      let errorMessage = fetchErrorMessage(error);

      message.error(errorMessage);
    }

    this.shiftLoading = false;
  }

  static Wrapper = Wrapper;
}

export const ConventionSideNavItemWithRouter = withRouter(
  ConventionSideNavItem,
);
