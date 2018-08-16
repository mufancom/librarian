import classNames from 'classnames';
import {action, observable} from 'mobx';
import React, {Component} from 'react';

import {RouteComponentProps, withRouter} from 'react-router';
import {AuthStore} from 'stores/auth-store';
import {
  ConventionIndexCategoryNode,
  ConventionIndexConventionNode,
} from 'stores/convention-store';
import {styled} from 'theme';
import {inject, observer} from 'utils/mobx';
import {ConventionSideNavAddBtn as _ConventionSideNavAddBtn} from './@convention-side-nav-add-btn';
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

  @observable
  showEdit = false;

  @observable
  showShiftButton = false;

  leaveTimer: any;

  render() {
    let {className, node} = this.props;

    return (
      <Wrapper className={classNames('convention-side-nav-group', className)}>
        <GroupTitle
          onMouseEnter={this.onMouseEnterTitle}
          onMouseLeave={this.onMouseLeaveTitle}
        >
          {node.entry.title}
          <PositionShiftButton
            show={this.showShiftButton && this.authStore.isLoggedIn}
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

  static Wrapper = Wrapper;
}

export const ConventionSideNavGroupWithRouter = withRouter(
  ConventionSideNavGroup,
);
