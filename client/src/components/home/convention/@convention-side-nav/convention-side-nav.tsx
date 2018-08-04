import * as React from 'react';
import {styled} from 'theme';
import {inject, observer} from 'utils/mobx';

import {RouteComponentProps, withRouter} from 'react-router';
import {ConventionIndexStore, IndexTree} from 'stores';
import {ConventionSideNavCategoryWithRouter} from './@convention-side-nav-category';

const Wrapper = styled.div`
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
  list: IndexTree[];
  className?: string;
}

const Menu: React.SFC<MenuProps> = props => {
  const list = props.list;
  if (list) {
    return (
      <ul className="menu">
        {list.map(val => (
          <ConventionSideNavCategoryWithRouter key={val.title} item={val} />
        ))}
      </ul>
    );
  } else {
    return <ul />;
  }
};

export interface ConventionSideNavProps extends RouteComponentProps<any> {
  conventionIndex: ConventionIndexStore;
}

@observer
export class ConventionSideNav extends React.Component<ConventionSideNavProps> {
  @inject
  conventionIndex!: ConventionIndexStore;

  render() {
    return (
      <Wrapper>
        <Menu list={this.props.conventionIndex.content} />
      </Wrapper>
    );
  }
}

export const ConventionSideNavWithRouter = withRouter(ConventionSideNav);
