import {Col, Layout, Row} from 'antd';
import classNames from 'classnames';
import * as React from 'react';
import styled from 'styled-components';

import {ConventionSideNavWithRouter} from './@convention-side-nav';
const {Content, Sider} = Layout;

const Wrapper = styled.div``;

interface ConventionProps {
  className?: string;
}

export class Convention extends React.Component<ConventionProps> {
  render() {
    let {className} = this.props;

    return (
      <Wrapper className={classNames('convention', className)}>
        <Row>
          <Col
            xs={{span: 24, offset: 0}}
            sm={{span: 22, offset: 1}}
            md={{span: 20, offset: 2}}
            lg={{span: 18, offset: 3}}
            xl={{span: 16, offset: 4}}
            className="header-nav"
          >
            <Layout>
              <Sider
                style={{
                  overflow: 'auto',
                  top: '88px',
                  bottom: 0,
                  position: 'fixed',
                  backgroundColor: 'transparent',
                }}
              >
                <ConventionSideNavWithRouter />
              </Sider>
              <Content
                style={{
                  margin: '0 16px 0 300px',
                  overflow: 'auto',
                  padding: 0,
                }}
              >
                <div style={{padding: 0, background: '#fff'}}>
                  ...
                  <br />
                  Really
                  <br />
                  ...
                  <br />
                  ...
                  <br />
                  ...
                  <br />
                  long
                  <br />
                  ...
                  <br />
                  ...
                  <br />
                  ...
                  <br />
                  ...
                  <br />
                  ...
                  <br />
                  ...
                  <br />
                  ...
                  <br />
                  ...
                  <br />
                  ...
                  <br />
                  ...
                  <br />
                  ...
                  <br />
                  ...
                  <br />
                  ...
                  <br />
                  ...
                  <br />
                  ...
                  <br />
                  ...
                  <br />
                  ...
                  <br />
                  ...
                  <br />
                  ...
                  <br />
                  ...
                  <br />
                  ...
                  <br />
                  ...
                  <br />
                  ...
                  <br />
                  ...
                  <br />
                  ...
                  <br />
                  ...
                  <br />
                  ...
                  <br />
                  ...
                  <br />
                  ...
                  <br />
                  ...
                  <br />
                  ...
                  <br />
                  ...
                  <br />
                  ...
                  <br />
                  ...
                  <br />
                  ...
                  <br />
                  ...
                  <br />
                  ...
                  <br />
                  ...
                  <br />
                  ...
                  <br />
                  ...
                  <br />
                  ...
                  <br />
                  content
                </div>
              </Content>
            </Layout>
          </Col>
        </Row>
      </Wrapper>
    );
  }
}
