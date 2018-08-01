import {Layout} from 'antd';
import {Provider} from 'mobx-react';
import * as React from 'react';
import {Route, Switch} from 'react-router';
import {ConventionIndexStore} from 'stores';
import {styled} from 'theme';

import {Header as HomeHeader} from './common';
import {Content as HomeContent} from './content';
import {Convention} from './convention';

const {Header, Content} = Layout;

const Wrapper = styled.div`
  .ant-layout {
    background: transparent;

    .ant-layout-header {
      background: ${props => props.theme.light};
      padding: 0 10px;
    }
  }

  .header {
    position: fixed;
    height: 80px;
    width: 100%;
    z-index: 100;
    display: block;
  }

  .content {
    margin-top: 80px;
  }
`;

const homeStore = {
  conventionIndex: new ConventionIndexStore(),
};

export class HomeContainer extends React.Component {
  render() {
    return (
      <Wrapper>
        <Provider {...homeStore}>
          <Layout>
            <Header className="header">
              <HomeHeader />
            </Header>
            <Content className="content">
              <Switch>
                <Route path="/convention" component={Convention} />
                <Route path="/" component={HomeContent} />
              </Switch>
            </Content>
          </Layout>
        </Provider>
      </Wrapper>
    );
  }
}
