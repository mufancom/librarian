import {Layout} from 'antd';
import {Provider} from 'mobx-react';
import * as React from 'react';
import {Route, Switch} from 'react-router';

import {conventionStore} from 'stores';
import {styled} from 'theme';
import {observer} from 'utils/mobx';

import {Content as HomeContent} from './content';
import {ConventionWithRouter} from './convention';
import {Header as HomeHeader} from './header';
import {HeaderLayoutWithRouter} from './header/header-layout';
import {RegisterInvitation} from './user';

const {Content} = Layout;

const Wrapper = styled.div`
  .ant-layout {
    background: transparent;
  }

  ${HomeHeader.Wrapper} {
    padding: 0 30px 0 10px;
    background: ${props => props.theme.light};
  }
`;

const homeStore = {
  conventionStore,
};

@observer
export class HomeContainer extends React.Component {
  render(): JSX.Element {
    return (
      <Wrapper>
        <Provider {...homeStore}>
          <Switch>
            <Route
              path="/user/register-invitation"
              component={RegisterInvitation}
            />
            <Route>
              <Layout>
                <HeaderLayoutWithRouter />
                <Content style={{marginTop: 110}}>
                  <Switch>
                    <Route
                      path="/convention"
                      component={ConventionWithRouter}
                    />
                    <Route path="/" component={HomeContent} />
                  </Switch>
                </Content>
              </Layout>
            </Route>
          </Switch>
        </Provider>
      </Wrapper>
    );
  }
}
