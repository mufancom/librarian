import {message} from 'antd';
import classNames from 'classnames';
import {action, computed, observable} from 'mobx';
import React, {Component, createRef} from 'react';
import ReactDOM from 'react-dom';
import FlipMove from 'react-flip-move';
import {RouteComponentProps, withRouter} from 'react-router';

import {fetchErrorMessage} from 'services/api-service';
import {ConventionService} from 'services/convention-service';
import {AuthStore} from 'stores/auth-store';
import {
  ConventionIndexCategoryNode,
  ConventionIndexConventionNode,
} from 'stores/convention-store';
import {styled} from 'theme';
import {collapseToEnd} from 'utils/dom';
import {inject, observer} from 'utils/mobx';

import {InputModal} from '../../../common/modal';

import {ConventionSideNavItemWithRouter} from './@convention-side-nav-item';
import {
  CancelBlocker,
  ConventionSideNavAddBtn,
  ConventionSideNavDeleteBtn,
  ConventionSideNavEditBtn,
  ConventionSideNavEditableTitle,
} from './@convention-side-nav-tools';
import {ConventionSideNavShiftBtn} from './@convention-side-nav-tools/convention-side-nav-shift-btn';

const Wrapper = styled.li`
  color: ${props => props.theme.text.navSecondary};
  font-size: 12.5px;
  font-weight: 300;
  padding-top: 12px;
  transition: all 0.3s;

  &.shift-loading {
    opacity: 0.5;
    transition: all 0.3s;
  }

  ul {
    padding: 6px 0;
  }

  ${ConventionSideNavAddBtn.Wrapper} {
    margin-top: -4px;
    margin-bottom: 10px;
  }
`;

const GroupTitle = styled.div`
  position: relative;

  & > ${ConventionSideNavShiftBtn.Wrapper} {
    position: absolute;
    right: 10px;
    top: 0;
  }
`;

export interface ConventionSideNavGroupProps extends RouteComponentProps<any> {
  className?: string;
  node: ConventionIndexCategoryNode;
}

@observer
export class ConventionSideNavGroup extends Component<
  ConventionSideNavGroupProps
> {
  @inject
  authStore!: AuthStore;

  @inject
  conventionService!: ConventionService;

  @observable
  showEdit = false;

  @observable
  mouseMoveIn = false;

  @observable
  inputModalVisible = false;

  @observable
  inputModalLoading = false;

  @observable
  renameMode = false;

  @observable
  renameLoading = false;

  @observable
  groupTitle = this.props.node.entry.title;

  @observable
  shiftLoading = false;

  groupTitleRef: React.RefObject<any> = createRef();

  renameCancelBlocker?: CancelBlocker;

  leaveTimer: any;

  @computed
  get showButtons(): boolean {
    return this.mouseMoveIn && this.authStore.isLoggedIn && !this.shiftLoading;
  }

  render(): JSX.Element {
    let {className, node} = this.props;

    return (
      <Wrapper
        className={classNames(
          'convention-side-nav-group',
          className,
          this.shiftLoading ? 'shift-loading' : undefined,
        )}
      >
        <InputModal
          title="新增规范"
          placeholder="请输入规范名"
          visible={this.inputModalVisible}
          onOkButtonClick={this.inputModalOkButtonOnclick}
          onCancelButtonClick={this.inputModelCancelButtonOnClick}
          loading={this.inputModalLoading}
        />
        <GroupTitle
          onMouseEnter={this.onMouseEnterTitle}
          onMouseLeave={this.onMouseLeaveTitle}
        >
          <ConventionSideNavEditableTitle
            renameMode={this.renameMode}
            setRenameMode={this.setRenameMode}
            getRenameModeCancelBlocker={this.setUpRenameModeCancelBlocker}
            onChange={this.onTitleChange}
            onFinish={this.onRenameFinishButtonClick}
            title={node.entry.title}
            ref={this.groupTitleRef}
          />
          <ConventionSideNavEditBtn
            show={this.showButtons}
            editMode={this.renameMode}
            editLoading={this.renameLoading}
            onClick={this.onRenameButtonClick}
            onFinishClick={this.onRenameFinishButtonClick}
          />
          <ConventionSideNavDeleteBtn
            show={this.showButtons && !this.renameMode}
            onClick={this.onDeleteButtonClick}
          />
          <ConventionSideNavShiftBtn
            show={this.showButtons}
            upOnclick={this.onUpShiftButtonClick}
            downOnclick={this.onDownShiftButtonClick}
          />
        </GroupTitle>
        <ul style={{marginTop: '7px'}}>
          {node.children && node.children.length > 0 ? (
            <FlipMove>
              {node.children.map(val => (
                <div key={val.entry.id}>
                  <ConventionSideNavItemWithRouter
                    node={val as ConventionIndexConventionNode}
                  />
                </div>
              ))}
            </FlipMove>
          ) : (
            <li />
          )}

          <ConventionSideNavAddBtn
            show={this.authStore.isLoggedIn}
            title="添加"
            onClick={this.addButtonOnclick}
          />
        </ul>
      </Wrapper>
    );
  }

  @action
  onMouseEnterTitle = (): void => {
    this.mouseMoveIn = true;
  };

  @action
  onMouseLeaveTitle = (): void => {
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
    this.groupTitle = value;
  };

  setTitleOnFocus(): void {
    let titleDom = ReactDOM.findDOMNode(
      this.groupTitleRef.current,
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
      await this.conventionService.renameCategory(entry.id, this.groupTitle);

      this.renameMode = false;
    } catch (error) {
      let errorMessage = fetchErrorMessage(error);

      message.error(errorMessage);
    }

    this.renameLoading = false;
  };

  @action
  addButtonOnclick = (): void => {
    this.inputModalVisible = true;
  };

  @action
  inputModelCancelButtonOnClick = (): void => {
    this.inputModalVisible = false;
  };

  @action
  inputModalOkButtonOnclick = async (value: string): Promise<void> => {
    let {
      node: {
        entry: {id},
      },
    } = this.props;

    this.inputModalLoading = true;

    try {
      await this.conventionService.createConvention(id, value);

      this.inputModalVisible = false;
    } catch (error) {
      let errorMessage = fetchErrorMessage(error);

      message.error(errorMessage);
    }

    this.inputModalLoading = false;
  };

  onDeleteButtonClick = async (): Promise<void> => {
    let {
      node: {
        entry: {id},
      },
    } = this.props;

    try {
      await this.conventionService.deleteCategory(id);
    } catch (error) {
      let errorMessage = fetchErrorMessage(error);

      message.error(errorMessage);
    }
  };

  onUpShiftButtonClick = async (): Promise<void> => {
    await this.shiftGroup(-2);
  };

  onDownShiftButtonClick = async (): Promise<void> => {
    await this.shiftGroup(1);
  };

  @action
  async shiftGroup(offset: number): Promise<void> {
    this.shiftLoading = true;

    let {
      node: {
        entry: {id, orderId},
      },
    } = this.props;

    try {
      await this.conventionService.shiftCategory(id, orderId + offset);
    } catch (error) {
      let errorMessage = fetchErrorMessage(error);

      message.error(errorMessage);
    }

    this.shiftLoading = false;
  }

  static Wrapper = Wrapper;
}

export const ConventionSideNavGroupWithRouter = withRouter(
  ConventionSideNavGroup,
);
