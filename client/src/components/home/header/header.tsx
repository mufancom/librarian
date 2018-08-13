import {Col, Row} from 'antd';
import classNames from 'classnames';
import * as React from 'react';
import {styled} from 'theme';

import {RouteComponentProps, withRouter} from 'react-router';
import {observer} from 'utils/mobx';
import {HeaderLogo} from './@header-logo';
import {HeaderNav, HeaderNavWithRouter} from './@header-nav';
import {HeaderUser} from './@header-user';

const Wrapper = styled.div`
  .header-nav {
    display: inline-block;
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
`;

export interface HeaderProps extends RouteComponentProps<any> {
  className?: string;
}

@observer
export class Header extends React.Component<HeaderProps> {
  render() {
    let {className} = this.props;

    return (
      <Wrapper className={classNames('header', className)}>
        <Row>
          <Col
            xs={{span: 24, offset: 0}}
            sm={{span: 22, offset: 1}}
            md={{span: 20, offset: 2}}
            lg={{span: 18, offset: 3}}
            xl={{span: 16, offset: 4}}
            className="header-nav"
          >
            <HeaderLogo />
            <MenuWrapper>
              <HeaderNavWithRouter />
              <HeaderUser />
            </MenuWrapper>
          </Col>
        </Row>
      </Wrapper>
    );
  }

  static Wrapper = Wrapper;
}

export const HeaderWithRouter = withRouter(Header);
