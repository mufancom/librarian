import classNames from 'classnames';
import React, {Component} from 'react';

import {RouteComponentProps, withRouter} from 'react-router';
import {IndexTree} from 'stores';
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
  item: IndexTree;
}

@observer
export class ConventionSideNavCategory extends Component<
  ConventionSideNavCategoryProps
> {
  render() {
    let {className, item} = this.props;

    return (
      <Wrapper
        className={classNames('convention-size-nav-category', className)}
      >
        <div>{item.title}</div>
        <ul>
          {item.children && item.children.length > 0 ? (
            item.children.map(
              val =>
                val.children && val.children.length > 0 ? (
                  <ConventionSideNavGroupWithRouter
                    key={val.title}
                    item={val}
                  />
                ) : (
                  <ConventionSideNavItemWithRouter key={val.title} item={val} />
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
