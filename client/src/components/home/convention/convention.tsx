import {Col, Layout, Row} from 'antd';
import * as React from 'react';

import {ConventionIndexStore} from 'stores';
import {ConventionSideNavWithRouter} from './@convention-side-nav';

const {Content, Sider} = Layout;

export interface ConventionProps {
  conventionIndex: ConventionIndexStore;
}

export class Convention extends React.Component<ConventionProps> {
  render() {
    return (
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
              <ConventionSideNavWithRouter {...this.props} />
            </Sider>
            <Content style={{margin: '24px 16px 0 300px', overflow: 'auto'}}>
              <div style={{padding: 24, background: '#fff'}}>
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
    );
  }
}
