import {Dropdown, Menu, message} from 'antd';
import classNames from 'classnames';
import {action, observable} from 'mobx';
import React, {Component, createRef} from 'react';
import ReactDOM from 'react-dom';
import {RouteComponentProps, withRouter} from 'react-router';

import {fetchErrorMessage} from 'services/api-service';
import {ConventionService} from 'services/convention-service';
import {AuthStore} from 'stores/auth-store';
import {ConventionIndexCategoryNode} from 'stores/convention-store';
import {styled} from 'theme';
import {inject, observer} from 'utils/mobx';
import {InputModal} from '../../../common/modal';
import {ConventionSideNavAddBtn as _ConventionSideNavAddBtn} from './@convention-side-nav-add-btn';
import {ConventionSideNavDeleteBtn as _ConventionSideNavDeleteBtn} from './@convention-side-nav-delete-btn';
import {ConventionSideNavGroupWithRouter} from './@convention-side-nav-group';
import {ConventionSideNavItemWithRouter} from './@convention-side-nav-item';
import {ConventionSideNavShiftBtn} from './@convention-side-nav-shift-btn';

const Wrapper = styled.li`
  color: ${props => props.theme.text.navPrimary};
  font-size: 17px;
  font-weight: 700;
  padding: 0;

  ul {
    padding: 38px 0 18px 0;
  }

  .add-menu {
    margin-right: -22px;
    margin-top: 7px;
  }
`;

const ConventionCategoryTitle = styled.div`
  margin-top: 30px;
  position: relative;
`;

const ConventionSideNavDeleteBtn = styled(_ConventionSideNavDeleteBtn)`
  display: inline;
  font-size: 13px;
  margin-left: 5px;
`;

const PositionShiftButton = styled(ConventionSideNavShiftBtn)`
  position: absolute;
  right: 36px;
  top: 1px;
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

const createAddMenuList = (onMenuClick: (index: number) => void) => (
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
  showEditButton = false;

  inputModalOkButtonOnclick?: (value: string) => void;

  wrapperRef: React.RefObject<any> = createRef();

  render() {
    let {className, node} = this.props;

    return (
      <Wrapper
        className={classNames('convention-size-nav-category', className)}
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
          {node.entry.title}
          <ConventionSideNavDeleteBtn
            show={this.showEditButton && this.authStore.isLoggedIn}
            onClick={this.onDeleteButtonClick}
          />
          <Dropdown
            overlay={createAddMenuList(this.addMenuItemOnclick)}
            trigger={['click']}
            getPopupContainer={this.getWrapperDom}
          >
            <ConventionSideNavAddBtn show={this.authStore.isLoggedIn} />
          </Dropdown>
          <PositionShiftButton
            show={this.showEditButton && this.authStore.isLoggedIn}
            upOnclick={this.onUpShiftButtonOnclick}
            downOnclick={this.onDownShiftButtonOnclick}
          />
        </ConventionCategoryTitle>
        <ul>
          {node.children && node.children.length > 0 ? (
            node.children.map(
              val =>
                val.type === 'convention' ? (
                  <ConventionSideNavItemWithRouter
                    key={val.entry.id}
                    node={val}
                  />
                ) : (
                  <ConventionSideNavGroupWithRouter
                    key={val.entry.id}
                    node={val}
                  />
                ),
            )
          ) : (
            <li />
          )}
        </ul>
      </Wrapper>
    );
  }

  getWrapperDom = () => {
    return ReactDOM.findDOMNode(this.wrapperRef.current) as HTMLLIElement;
  };

  @action
  onMouseEnterTitle = () => {
    this.showEditButton = true;
  };

  @action
  onMouseLeaveTitle = () => {
    this.showEditButton = false;
  };

  @action
  inputModelCancelButtonOnClick = () => {
    this.inputModalVisible = false;
  };

  addMenuItemOnclick = (index: number) => {
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
  addGroupOnclick = () => {
    this.inputModalVisible = true;
    this.inputModalTitle = '新增子分组';
    this.inputModalPlaceholder = '请输入分组名';

    this.inputModalOkButtonOnclick = this.addGroupModalOkButtonOnclick;
  };

  @action
  addGroupModalOkButtonOnclick = async (value: string) => {
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
  addConventionOnclick = () => {
    this.inputModalVisible = true;
    this.inputModalTitle = '新增规范';
    this.inputModalPlaceholder = '请输入规范名';

    this.inputModalOkButtonOnclick = this.addConventionModalOkButtonOnclick;
  };

  @action
  addConventionModalOkButtonOnclick = async (value: string) => {
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

  onDeleteButtonClick = async () => {
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

  onUpShiftButtonOnclick = async () => {
    await this.shiftCategory(-2);
  };

  onDownShiftButtonOnclick = async () => {
    await this.shiftCategory(1);
  };

  async shiftCategory(offset: number) {
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

export const ConventionSideNavCategoryWithRouter = withRouter(
  ConventionSideNavCategory,
);
