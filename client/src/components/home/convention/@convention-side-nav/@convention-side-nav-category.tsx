import {Dropdown, Menu} from 'antd';
import classNames from 'classnames';
import React, {Component, createRef} from 'react';
import ReactDOM from 'react-dom';
import {RouteComponentProps, withRouter} from 'react-router';

import {AuthStore} from 'stores/auth-store';
import {ConventionIndexCategoryNode} from 'stores/convention-store';
import {styled} from 'theme';
import {inject, observer} from 'utils/mobx';
import {action, observable} from '../../../../../../node_modules/mobx';
import {InputModal} from '../../../common/modal';
import {ConventionSideNavAddBtn as _ConventionSideNavAddBtn} from './@convention-side-nav-add-btn';
import {ConventionSideNavGroupWithRouter} from './@convention-side-nav-group';
import {ConventionSideNavItemWithRouter} from './@convention-side-nav-item';

const Wrapper = styled.li`
  color: ${props => props.theme.text.navPrimary};
  font-size: 17px;
  font-weight: 700;
  padding: 0;

  & > div {
    margin-top: 30px;
  }

  ul {
    padding: 38px 0 18px 0;
  }

  .add-menu {
    margin-right: -22px;
    margin-top: 7px;
  }
`;

const ConventionSideNavAddBtn = styled(_ConventionSideNavAddBtn)`
  float: right;
  margin-right: 30px;
  margin-top: -5px;
`;

const DeleteButton = styled.a`
  color: ${props => props.theme.dangerAccent()} !important;
`;

const createAddMenuList = (onMenuClick: (index: number) => void) => (
  <Menu className="add-menu">
    <Menu.Item key="0">
      <a
        onClick={() => {
          onMenuClick(0);
        }}
      >
        新增分组
      </a>
    </Menu.Item>
    <Menu.Item key="1">
      <a
        onClick={() => {
          onMenuClick(1);
        }}
      >
        新增规范
      </a>
    </Menu.Item>
    <Menu.Divider />
    <Menu.Item key="3">
      <DeleteButton
        onClick={() => {
          onMenuClick(2);
        }}
      >
        删除
      </DeleteButton>
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

  @observable
  inputModelVisible = false;

  wrapperRef: React.RefObject<any> = createRef();

  render() {
    let {className, node} = this.props;

    return (
      <Wrapper
        className={classNames('convention-size-nav-category', className)}
        ref={this.wrapperRef}
      >
        <InputModal title="请输入" visible={this.inputModelVisible} />
        <div>
          {node.entry.title}
          <Dropdown
            overlay={createAddMenuList(this.addMenuItemOnclick)}
            trigger={['click']}
            getPopupContainer={this.getWrapperDom}
          >
            <ConventionSideNavAddBtn show={this.authStore.isLoggedIn} />
          </Dropdown>
        </div>
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
  addMenuItemOnclick = (index: number) => {
    this.inputModelVisible = true;
    // tslint:disable-next-line:no-console
    console.log(index);
  };

  static Wrapper = Wrapper;
}

export const ConventionSideNavCategoryWithRouter = withRouter(
  ConventionSideNavCategory,
);
