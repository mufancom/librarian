import classNames from 'classnames';
import React, {Component} from 'react';
import {RouteComponentProps} from 'react-router';
import {NavLink, withRouter} from 'react-router-dom';

import {styled} from 'theme';
import {observer} from 'utils/mobx';

const Wrapper = styled.div`
  ul {
    li {
      list-style-type: none;
      float: left;

      a {
        display: inline-block;
        text-decoration: none;
        color: ${props => props.theme.text.navPlaceholder};
        font-size: 16px;
        padding: 0 20px;

        &:hover {
          color: ${props => props.theme.text.navPrimary};
        }

        &.active {
          color: ${props => props.theme.text.navPrimary};

          &::after {
            top: -10px;
            content: '';
            margin-left: auto;
            margin-right: auto;
            position: relative;
            display: block;
            width: 20px;
            height: 4px;
            background-color: ${props => props.theme.accent()};
          }
        }
      }
    }
  }
`;

const HeaderNavLink = styled(NavLink)``;

export interface HeaderNavProps extends RouteComponentProps<any> {
  className?: string;
}

@observer
export class HeaderNav extends Component<HeaderNavProps> {
  render() {
    let {className} = this.props;

    return (
      <Wrapper className={classNames('header-nav', className)}>
        <ul>
          <li>
            <NavLink to="/convention">规范</NavLink>
          </li>
          <li>
            <NavLink to="/qa">问答</NavLink>
          </li>
          <li>
            <NavLink to="/proposal">提议</NavLink>
          </li>
        </ul>
      </Wrapper>
    );
  }

  static Wrapper = Wrapper;
}

export const HeaderNavWithRouter = withRouter(HeaderNav);
