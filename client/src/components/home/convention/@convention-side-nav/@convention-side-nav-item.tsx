import classNames from 'classnames';
import React, {Component} from 'react';
import {NavLink, RouteComponentProps, withRouter} from 'react-router-dom';

import {ConventionIndexConventionNode} from 'stores/convention-store';
import {styled} from 'theme';

const Wrapper = styled.li`
  color: ${props => props.theme.text.navRegular};
  font-size: 14px;
  font-weight: 400;
  padding-top: 15px;
  list-style-type: none;

  a {
    color: ${props => props.theme.text.navRegular};
    text-decoration: none;

    &:hover {
      color: ${props => props.theme.accent()};
    }

    &.active {
      color: ${props => props.theme.accent()};
    }
  }
`;

export interface ConventionSideNavItemProps extends RouteComponentProps<any> {
  className?: string;
  node: ConventionIndexConventionNode;
}

export class ConventionSideNavItem extends Component<
  ConventionSideNavItemProps
> {
  render() {
    let {
      className,
      node: {entry},
    } = this.props;

    return (
      <Wrapper className={classNames('convention-side-nav-item', className)}>
        <NavLink to={`/convention/${entry.id}`}>{entry.title}</NavLink>
      </Wrapper>
    );
  }

  static Wrapper = Wrapper;
}

export const ConventionSideNavItemWithRouter = withRouter(
  ConventionSideNavItem,
);
