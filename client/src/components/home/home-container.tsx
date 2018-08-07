import {Layout} from 'antd';
import {Provider} from 'mobx-react';
import * as React from 'react';
import {Route, Switch} from 'react-router';
import {ConventionIndexStore} from 'stores/convention-index-store';
import {styled} from 'theme';

import {Content as HomeContent} from './content';
import {Convention} from './convention';
import {
  Header as HomeHeader,
  HeaderWithRouter as HomeHeaderWithRouter,
} from './header';

const {Header, Content} = Layout;

const Wrapper = styled.div`
  .ant-layout {
    background: transparent;

    .ant-layout-header {
      background: ${props => props.theme.light};
      padding: 0 10px;
    }
  }

  ${HomeHeader.Wrapper} {
    position: fixed;
    height: 80px;
    width: 100%;
    z-index: 100;
    display: block;
    background: ${props => props.theme.light};
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
            <Header>
              <HomeHeaderWithRouter />
            </Header>
            <Content style={{marginTop: 80}}>
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
