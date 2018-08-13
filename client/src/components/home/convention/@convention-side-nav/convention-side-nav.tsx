import classNames from 'classnames';
import * as React from 'react';
import {styled} from 'theme';
import {inject, observer} from 'utils/mobx';

import {RouteComponentProps, withRouter} from 'react-router';
import {
  ConventionIndexCategoryNode,
  ConventionIndexNode,
  ConventionStore,
} from 'stores/convention-store';
import {ConventionSideNavCategoryWithRouter} from './@convention-side-nav-category';

const Wrapper = styled.div`
  margin-bottom: 40px;

  ul {
    margin: 0;
    padding: 0;
  }

  li {
    list-style-type: none;
    display: block;
    text-indent: 0;
  }

  ul.menu {
    margin-top: 20px;
    padding-left: 30px;
  }
`;

interface MenuProps {
  list: ConventionIndexNode[];
  className?: string;
}

const Menu: React.SFC<MenuProps> = props => {
  const list = props.list;
  if (list) {
    return (
      <ul className="menu">
        {list.map(val => (
          <ConventionSideNavCategoryWithRouter
            key={val.entry.id}
            node={val as ConventionIndexCategoryNode}
          />
        ))}
      </ul>
    );
  } else {
    return <ul />;
  }
};

export interface ConventionSideNavProps extends RouteComponentProps<any> {
  className?: string;
}

@observer
export class ConventionSideNav extends React.Component<ConventionSideNavProps> {
  @inject
  conventionStore!: ConventionStore;

  render() {
    let {className} = this.props;

    return (
      <Wrapper className={classNames('convention-side-nav', className)}>
        <Menu list={this.conventionStore.index} />
      </Wrapper>
    );
  }
}

export const ConventionSideNavWithRouter = withRouter(ConventionSideNav);
