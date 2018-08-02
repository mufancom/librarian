import {Col, Row} from 'antd';
import logoImg from 'assets/images/librarian.svg';
import * as React from 'react';
import {styled} from 'theme';

import {HeaderNav, HeaderNavWithRouter} from './@header-nav';
import {HeaderUser} from './@header-user';

const Wrapper = styled.div`
  .header-nav {
    display: inline-block;
    position: relative;
    padding-top: 10px;
  }

  .logo {
    float: left;
    height: 70px;
    margin-left: 10px;

    .logo-icon {
      float: left;
      img {
        height: 38px;
        width: 38px;
      }
    }

    .logo-text {
      float: left;
      padding-left: 10px;
      font-size: 23px;
      font-weight: lighter;
      color: #409eff;
    }
  }

  .menu {
    float: right;
  }

  ${HeaderNav.Wrapper} {
    float: left;
  }

  ${HeaderUser.Wrapper} {
    float: left;
    margin-left: 10px;
  }
`;

export class Header extends React.Component {
  render() {
    return (
      <Wrapper>
        <Row>
          <Col
            xs={{span: 24, offset: 0}}
            sm={{span: 22, offset: 1}}
            md={{span: 20, offset: 2}}
            lg={{span: 18, offset: 3}}
            xl={{span: 16, offset: 4}}
            className="header-nav"
          >
            <div className="logo">
              <div className="logo-icon">
                <img src={logoImg} />
              </div>
              <div className="logo-text">Librarian</div>
            </div>
            <div className="menu">
              <HeaderNavWithRouter />
              <HeaderUser />
            </div>
          </Col>
        </Row>
      </Wrapper>
    );
  }
}
