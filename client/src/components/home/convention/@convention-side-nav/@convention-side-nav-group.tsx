import {message} from 'antd';
import classNames from 'classnames';
import {action, observable} from 'mobx';
import React, {Component} from 'react';

import {RouteComponentProps, withRouter} from 'react-router';
import {fetchErrorMessage} from 'services/api-service';
import {ConventionService} from 'services/convention-service';
import {AuthStore} from 'stores/auth-store';
import {
  ConventionIndexCategoryNode,
  ConventionIndexConventionNode,
} from 'stores/convention-store';
import {styled} from 'theme';
import {inject, observer} from 'utils/mobx';
import {InputModal} from '../../../common/modal';
import {ConventionSideNavAddBtn as _ConventionSideNavAddBtn} from './@convention-side-nav-add-btn';
import {ConventionSideNavDeleteBtn as _ConventionSideNavDeleteBtn} from './@convention-side-nav-delete-btn';
import {ConventionSideNavItemWithRouter} from './@convention-side-nav-item';
import {ConventionSideNavShiftBtn} from './@convention-side-nav-shift-btn';

const Wrapper = styled.li`
  color: ${props => props.theme.text.navSecondary};
  font-size: 12.5px;
  font-weight: 300;
  padding: 5px 0;

  & > div {
    margin-top: 10px;
  }

  ul {
    padding: 6px 0;
  }
`;

const GroupTitle = styled.div`
  position: relative;
`;

const ConventionSideNavAddBtn = styled(_ConventionSideNavAddBtn)`
  margin-top: 5px;
  margin-bottom: 5px;
`;

const ConventionSideNavDeleteBtn = styled(_ConventionSideNavDeleteBtn)`
  display: inline !important;
  margin-left: 5px;
`;

const PositionShiftButton = styled(ConventionSideNavShiftBtn)`
  position: absolute;
  right: 10px;
  top: -3px;
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

  leaveTimer: any;

  render() {
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
          {node.entry.title}
          <ConventionSideNavDeleteBtn
            show={this.showShiftButton && this.authStore.isLoggedIn}
            onClick={this.onDeleteButtonClick}
          />
          <PositionShiftButton
            show={this.showShiftButton && this.authStore.isLoggedIn}
            upOnclick={this.onUpShiftButtonClick}
            downOnclick={this.onDownShiftButtonClick}
          />
        </GroupTitle>
        <ul>
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
  onMouseEnterTitle = () => {
    this.showShiftButton = true;
  };

  @action
  onMouseLeaveTitle = () => {
    this.showShiftButton = false;
  };

  @action
  addButtonOnclick = () => {
    this.inputModalVisible = true;
  };

  @action
  inputModelCancelButtonOnClick = () => {
    this.inputModalVisible = false;
  };

  @action
  inputModalOkButtonOnclick = async (value: string) => {
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

  onUpShiftButtonClick = async () => {
    await this.shiftGroup(-2);
  };

  onDownShiftButtonClick = async () => {
    await this.shiftGroup(1);
  };

  async shiftGroup(offset: number) {
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
