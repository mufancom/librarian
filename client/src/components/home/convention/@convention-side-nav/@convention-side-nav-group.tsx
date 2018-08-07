import classNames from 'classnames';
import React, {Component} from 'react';

import {RouteComponentProps, withRouter} from 'react-router';
import {IndexTree} from 'stores/convention-index-store';
import {styled} from 'theme';
import {ConventionSideNavItemWithRouter} from './@convention-side-nav-item';

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

export interface ConventionSideNavGroupProps extends RouteComponentProps<any> {
  className?: string;
  item: IndexTree;
}

export class ConventionSideNavGroup extends Component<
  ConventionSideNavGroupProps
> {
  render() {
    let {className, item} = this.props;

    return (
      <Wrapper className={classNames('convention-side-nav-group', className)}>
        <div>{item.title}</div>
        <ul>
          {item.children && item.children.length > 0 ? (
            item.children.map(val => (
              <ConventionSideNavItemWithRouter key={val.title} item={val} />
            ))
          ) : (
            <li />
          )}
        </ul>
      </Wrapper>
    );
  }

  static Wrapper = Wrapper;
}

export const ConventionSideNavGroupWithRouter = withRouter(
  ConventionSideNavGroup,
);
