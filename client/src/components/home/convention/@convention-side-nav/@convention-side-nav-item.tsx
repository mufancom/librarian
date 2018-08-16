import classNames from 'classnames';
import {action, observable} from 'mobx';
import React, {Component} from 'react';
import {NavLink, RouteComponentProps, withRouter} from 'react-router-dom';

import {AuthStore} from 'stores/auth-store';
import {ConventionIndexConventionNode} from 'stores/convention-store';
import {styled} from 'theme';
import {inject, observer} from 'utils/mobx';
import {ConventionSideNavShiftBtn} from './@convention-side-nav-shift-btn';

const Wrapper = styled.li`
  color: ${props => props.theme.text.navRegular};
  position: relative;
  font-size: 14px;
  font-weight: 400;
  padding-top: 15px;
  list-style-type: none;
  display: block;

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
`;

const PositionShiftButton = styled(ConventionSideNavShiftBtn)`
  position: absolute;
  right: 10px;
  top: 13px;
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

  @observable
  showShiftButton = false;

  render() {
    let {
      className,
      node: {entry},
    } = this.props;

    return (
      <Wrapper
        className={classNames('convention-side-nav-item', className)}
        onMouseEnter={this.onMouseEnter}
        onMouseLeave={this.onMouseLeave}
      >
        <NavLink to={`/convention/${entry.id}`}>{entry.title}</NavLink>
        <PositionShiftButton
          show={this.showShiftButton && this.authStore.isLoggedIn}
        />
      </Wrapper>
    );
  }

  @action
  onMouseEnter = () => {
    this.showShiftButton = true;
  };

  @action
  onMouseLeave = () => {
    this.showShiftButton = false;
  };

  static Wrapper = Wrapper;
}

export const ConventionSideNavItemWithRouter = withRouter(
  ConventionSideNavItem,
);
