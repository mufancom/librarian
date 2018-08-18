import {message} from 'antd';
import classNames from 'classnames';
import {action, observable} from 'mobx';
import React, {Component, createRef} from 'react';
import ReactDOM from 'react-dom';
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
  showShiftButton = false;

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

  groupTitleRef: React.RefObject<any> = createRef();

  renameCancelBlocker?: CancelBlocker;

  leaveTimer: any;

  render(): JSX.Element {
    let {className, node} = this.props;

    return (
      <Wrapper className={classNames('convention-side-nav-group', className)}>
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
            show={this.showShiftButton && this.authStore.isLoggedIn}
            editMode={this.renameMode}
            editLoading={this.renameLoading}
            onClick={this.onRenameButtonClick}
            onFinishClick={this.onRenameFinishButtonClick}
          />
          <ConventionSideNavDeleteBtn
            show={
              this.showShiftButton &&
              this.authStore.isLoggedIn &&
              !this.renameMode
            }
            onClick={this.onDeleteButtonClick}
          />
          <ConventionSideNavShiftBtn
            show={this.showShiftButton && this.authStore.isLoggedIn}
            upOnclick={this.onUpShiftButtonClick}
            downOnclick={this.onDownShiftButtonClick}
          />
        </GroupTitle>
        <ul style={{marginTop: '7px'}}>
          {node.children && node.children.length > 0 ? (
            node.children.map(val => (
              <ConventionSideNavItemWithRouter
                key={val.entry.id}
                node={val as ConventionIndexConventionNode}
              />
            ))
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
    this.showShiftButton = true;
  };

  @action
  onMouseLeaveTitle = (): void => {
    this.showShiftButton = false;
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

  async shiftGroup(offset: number): Promise<void> {
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
  }

  static Wrapper = Wrapper;
}

export const ConventionSideNavGroupWithRouter = withRouter(
  ConventionSideNavGroup,
);
