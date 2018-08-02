import {createBrowserHistory} from 'history';
import {Provider} from 'mobx-react';
import {RouterStore, syncHistoryWithStore} from 'mobx-react-router';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {Route, Router, Switch} from 'react-router';
import {ThemeProvider} from 'styled-components';

import {theme} from 'theme';
import registerServiceWorker from 'utils/register-service-worker';

import './global.less';

import {HomeContainer} from 'components/home/home-container';
import {AuthStore} from 'stores';

const browserHistory = createBrowserHistory();
const routerStore = new RouterStore();
const history = syncHistoryWithStore(browserHistory, routerStore);

const stores = {
  authStore: new AuthStore(),
  routerStore,
};

ReactDOM.render(
  <ThemeProvider theme={theme}>
    <Provider {...stores}>
      <Router history={history}>
        <Switch>
          <Route path="/" component={HomeContainer} />
        </Switch>
      </Router>
    </Provider>
  </ThemeProvider>,
  document.getElementById('root') as HTMLElement,
);
registerServiceWorker();
