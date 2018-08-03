import * as React from 'react';
import {NavLink} from 'react-router-dom';
import {styled} from 'theme';
import {inject, observer} from 'utils/mobx';

import {ConventionIndexStore, IndexTree} from 'stores';
import {ConventionProps} from './convention';

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

    li.category {
      color: ${props => props.theme.text.navPrimary};
      font-size: 17px;
      font-weight: 700;
      padding: 0;

      ul {
        padding: 18px 0;
      }
    }

    li.group {
      color: ${props => props.theme.text.navSecondary};
      font-size: 12.5px;
      font-weight: 300;
      padding: 5px 0;

      ul {
        padding: 6px 0;
      }
    }

    li.item {
      color: ${props => props.theme.text.navRegular};
      font-size: 14px;
      font-weight: 300;
      padding: 8px 0;

      a {
        color: ${props => props.theme.text.navRegular};

        &:hover {
          color: ${props => props.theme.accent()};
        }

        &.active {
          color: ${props => props.theme.accent()};
        }
      }
    }
  }
`;

function RenderMenuList(props: {list?: IndexTree[]}) {
  function Item(props: {item: IndexTree}) {
    const item = props.item;
    return (
      <li className="item">
        <NavLink to={item.url ? item.url : '#'}>{item.title}</NavLink>
      </li>
    );
  }

  function Group(props: {item: IndexTree}) {
    const item = props.item;
    return (
      <li className="group">
        <div>{item.title}</div>
        <ul>
          {item.children && item.children.length > 0 ? (
            item.children.map(val => <Item key={val.title} item={val} />)
          ) : (
            <li />
          )}
        </ul>
      </li>
    );
  }

  function Category(props: {item: IndexTree}) {
    const item = props.item;
    return (
      <li className="category">
        <div>{item.title}</div>
        <ul>
          {item.children && item.children.length > 0 ? (
            item.children.map(
              val =>
                val.children && val.children.length > 0 ? (
                  <Group key={val.title} item={val} />
                ) : (
                  <Item key={val.title} item={val} />
                ),
            )
          ) : (
            <li />
          )}
        </ul>
      </li>
    );
  }

  const list = props.list;
  if (list) {
    return (
      <ul className="menu">
        {list.map(val => (
          <Category key={val.title} item={val} />
        ))}
      </ul>
    );
  } else {
    return <ul />;
  }
}

export interface SideNavProps extends ConventionProps {}

@observer
export class SideNav extends React.Component<SideNavProps> {
  @inject
  conventionIndex!: ConventionIndexStore;

  render() {
    return (
      <Wrapper>
        <RenderMenuList list={this.props.conventionIndex.content} />
      </Wrapper>
    );
  }
}
