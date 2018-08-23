import {Dropdown, Menu, message} from 'antd';
import classNames from 'classnames';
import {action, computed, observable} from 'mobx';
import React, {Component, createRef} from 'react';
import ReactDOM from 'react-dom';
import FlipMove from 'react-flip-move';
import {RouteComponentProps, withRouter} from 'react-router';

import {fetchErrorMessage} from 'services/api-service';
import {ConventionService} from 'services/convention-service';
import {AuthStore} from 'stores/auth-store';
import {ConventionIndexCategoryNode} from 'stores/convention-store';
import {styled} from 'theme';
import {collapseToEnd} from 'utils/dom';
import {inject, observer} from 'utils/mobx';

import {InputModal} from '../../../common/modal';

import {ConventionSideNavGroupWithRouter} from './@convention-side-nav-group';
import {ConventionSideNavItemWithRouter} from './@convention-side-nav-item';
import {
  CancelBlocker,
  ConventionSideNavAddBtn as _ConventionSideNavAddBtn,
  ConventionSideNavDeleteBtn,
  ConventionSideNavEditBtn,
  ConventionSideNavEditableTitle,
} from './@convention-side-nav-tools';
import {ConventionSideNavShiftBtn} from './@convention-side-nav-tools/convention-side-nav-shift-btn';

const Wrapper = styled.li`
  color: ${props => props.theme.text.navPrimary};
  font-size: 17px;
  font-weight: 700;
  padding: 0;
  transition: all 0.3s;

  &.shift-loading {
    opacity: 0.5;
    transition: all 0.3s;
  }

  ul {
    padding: 38px 0 18px 0;
  }

  .add-menu {
    margin-right: -22px;
    margin-top: 10px;
  }

  ${ConventionSideNavEditableTitle.Wrapper} {
    display: inline-block;
    max-width: 130px;
  }

  ${ConventionSideNavEditBtn.Wrapper}, ${ConventionSideNavDeleteBtn.Wrapper} {
    font-size: 13px;
  }
`;

const ConventionCategoryTitle = styled.div`
  margin-top: 30px;
  position: relative;
  margin-bottom: 7px;

  & > ${ConventionSideNavShiftBtn.Wrapper} {
    position: absolute;
    right: 36px;
    top: 4px;
  }

  & > ${ConventionSideNavEditableTitle.Wrapper} {
    max-width: 110px;
  }
`;

const ConventionSideNavAddBtn = styled(_ConventionSideNavAddBtn)`
  float: right;
  margin-right: 30px;
  margin-top: -5px;
`;

enum MenuOption {
  addGroup,
  addConvention,
  delete,
}

const createAddMenuList = (
  onMenuClick: (index: number) => void,
): JSX.Element => (
  <Menu className="add-menu">
    <Menu.Item key="0">
      <a
        onClick={() => {
          onMenuClick(MenuOption.addGroup);
        }}
      >
        新增子分组
      </a>
    </Menu.Item>
    <Menu.Item key="1">
      <a
        onClick={() => {
          onMenuClick(MenuOption.addConvention);
        }}
      >
        新增规范
      </a>
    </Menu.Item>
  </Menu>
);

export interface ConventionSideNavCategoryProps
  extends RouteComponentProps<any> {
  className?: string;
  node: ConventionIndexCategoryNode;
}

@observer
export class ConventionSideNavCategory extends Component<
  ConventionSideNavCategoryProps
> {
  @inject
  authStore!: AuthStore;

  @inject
  conventionService!: ConventionService;

  @observable
  inputModalVisible = false;

  @observable
  inputModalTitle = '';

  @observable
  inputModalPlaceholder = '';

  @observable
  inputModalLoading = false;

  @observable
  mouseMoveIn = false;

  @observable
  renameMode = false;

  @observable
  renameLoading = false;

  @observable
  categoryTitle = this.props.node.entry.title;

  @observable
  shiftLoading = false;

  categoryTitleRef: React.RefObject<any> = createRef();

  renameCancelBlocker?: CancelBlocker;

  inputModalOkButtonOnclick?: (value: string) => void;

  wrapperRef: React.RefObject<any> = createRef();

  @computed
  get showButtons(): boolean {
    return this.mouseMoveIn && this.authStore.isLoggedIn && !this.shiftLoading;
  }

  render(): JSX.Element {
    let {className, node} = this.props;

    return (
      <Wrapper
        className={classNames(
          'convention-size-nav-category',
          className,
          this.shiftLoading ? 'shift-loading' : undefined,
        )}
        ref={this.wrapperRef}
      >
        <InputModal
          title={this.inputModalTitle}
          placeholder={this.inputModalPlaceholder}
          visible={this.inputModalVisible}
          onOkButtonClick={this.inputModalOkButtonOnclick}
          onCancelButtonClick={this.inputModelCancelButtonOnClick}
          loading={this.inputModalLoading}
        />

        <ConventionCategoryTitle
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
            ref={this.categoryTitleRef}
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
          <Dropdown
            overlay={createAddMenuList(this.addMenuItemOnclick)}
            trigger={['click']}
            getPopupContainer={this.getWrapperDom}
          >
            <ConventionSideNavAddBtn show={this.authStore.isLoggedIn} />
          </Dropdown>
          <ConventionSideNavShiftBtn
            show={this.showButtons}
            upOnclick={this.onUpShiftButtonOnclick}
            downOnclick={this.onDownShiftButtonOnclick}
          />
        </ConventionCategoryTitle>
        <ul>
          {node.children && node.children.length > 0 ? (
            <FlipMove>
              {node.children.map(
                val =>
                  val.type === 'convention' ? (
                    <div key={val.type + val.entry.id}>
                      <ConventionSideNavItemWithRouter node={val} />
                    </div>
                  ) : (
                    <div key={val.type + val.entry.id}>
                      <ConventionSideNavGroupWithRouter node={val} />
                    </div>
                  ),
              )}
            </FlipMove>
          ) : (
            <li />
          )}
        </ul>
      </Wrapper>
    );
  }

  getWrapperDom = (): HTMLLIElement => {
    return ReactDOM.findDOMNode(this.wrapperRef.current) as HTMLLIElement;
  };

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
    this.categoryTitle = value;
  };

  setTitleOnFocus(): void {
    let titleDom = ReactDOM.findDOMNode(
      this.categoryTitleRef.current,
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
      await this.conventionService.renameCategory(entry.id, this.categoryTitle);

      this.renameMode = false;
    } catch (error) {
      let errorMessage = fetchErrorMessage(error);

      message.error(errorMessage);
    }

    this.renameLoading = false;
  };

  @action
  inputModelCancelButtonOnClick = (): void => {
    this.inputModalVisible = false;
  };

  addMenuItemOnclick = (index: number): void => {
    switch (index) {
      case MenuOption.addGroup:
        this.addGroupOnclick();
        break;

      case MenuOption.addConvention:
        this.addConventionOnclick();
        break;
    }
  };

  @action
  addGroupOnclick = (): void => {
    this.inputModalVisible = true;
    this.inputModalTitle = '新增子分组';
    this.inputModalPlaceholder = '请输入分组名';

    this.inputModalOkButtonOnclick = this.addGroupModalOkButtonOnclick;
  };

  @action
  addGroupModalOkButtonOnclick = async (value: string): Promise<void> => {
    let {
      node: {
        entry: {id},
      },
    } = this.props;

    this.inputModalLoading = true;

    try {
      await this.conventionService.createCategory(id, value);

      this.inputModalVisible = false;
    } catch (error) {
      let errorMessage = fetchErrorMessage(error);

      message.error(errorMessage);
    }

    this.inputModalLoading = false;
  };

  @action
  addConventionOnclick = (): void => {
    this.inputModalVisible = true;
    this.inputModalTitle = '新增规范';
    this.inputModalPlaceholder = '请输入规范名';

    this.inputModalOkButtonOnclick = this.addConventionModalOkButtonOnclick;
  };

  @action
  addConventionModalOkButtonOnclick = async (value: string): Promise<void> => {
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

  onUpShiftButtonOnclick = async (): Promise<void> => {
    await this.shiftCategory(-2);
  };

  onDownShiftButtonOnclick = async (): Promise<void> => {
    await this.shiftCategory(1);
  };

  @action
  async shiftCategory(offset: number): Promise<void> {
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

export const ConventionSideNavCategoryWithRouter = withRouter(
  ConventionSideNavCategory,
);
