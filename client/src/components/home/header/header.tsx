import classNames from 'classnames';
import * as React from 'react';
import {RouteComponentProps, withRouter} from 'react-router';

import {styled} from 'theme';
import {observer} from 'utils/mobx';

import {HeaderLogo} from './@header-logo';
import {HeaderNav, HeaderNavWithRouter} from './@header-nav';
import {HeaderUser} from './@header-user';

const Wrapper = styled.div`
  .header-nav {
    display: block;
    position: relative;
    padding-top: 10px;
  }

  ${HeaderLogo.Wrapper} {
    margin-left: 15px;
    margin-top: 10px;
  }

  ${HeaderNav.Wrapper} {
    float: left;
  }

  ${HeaderUser.Wrapper} {
    float: left;
    margin-left: 10px;
  }
`;

const MenuWrapper = styled.div`
  float: right;
  margin-right: 10px;
`;

export interface HeaderProps extends RouteComponentProps<any> {
  className?: string;
}

@observer
export class Header extends React.Component<HeaderProps> {
  render(): JSX.Element {
    let {className} = this.props;

    return (
      <Wrapper className={classNames('header', className)}>
        <div className="header-nav header-nav-with-hint-bar">
          <HeaderLogo />
          <MenuWrapper>
            <HeaderNavWithRouter />
            <HeaderUser />
          </MenuWrapper>
        </div>
      </Wrapper>
    );
  }

  static Wrapper = Wrapper;
}

export const HeaderWithRouter = withRouter(Header);
