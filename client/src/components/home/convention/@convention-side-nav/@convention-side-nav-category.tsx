import classNames from 'classnames';
import React, {Component} from 'react';

import {RouteComponentProps, withRouter} from 'react-router';
import {ConventionIndexCategoryNode} from 'stores/convention-store';
import {styled} from 'theme';
import {observer} from 'utils/mobx';
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
`;

export interface ConventionSideNavCategoryProps
  extends RouteComponentProps<any> {
  className?: string;
  node: ConventionIndexCategoryNode;
}

@observer
export class ConventionSideNavCategory extends Component<
  ConventionSideNavCategoryProps
> {
  render() {
    let {className, node} = this.props;

    return (
      <Wrapper
        className={classNames('convention-size-nav-category', className)}
      >
        <div>{node.entry.title}</div>
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

  static Wrapper = Wrapper;
}

export const ConventionSideNavCategoryWithRouter = withRouter(
  ConventionSideNavCategory,
);
