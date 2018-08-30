import {createBrowserHistory} from 'history';
import {Provider} from 'mobx-react';
import {syncHistoryWithStore} from 'mobx-react-router';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {Route, Router, Switch} from 'react-router';
import {ThemeProvider} from 'styled-components';

import {HomeContainer} from 'components/home';
import * as services from 'services';
import * as stores from 'stores';
import {theme} from 'theme';
import * as ServiceWorker from 'utils/service-worker';

import './global.less';

const browserHistory = createBrowserHistory();
const history = syncHistoryWithStore(browserHistory, stores.routerStore);

ReactDOM.render(
  <ThemeProvider theme={theme}>
    <Provider {...stores} {...services}>
      <Router history={history}>
        <Switch>
          <Route path="/" component={HomeContainer} />
        </Switch>
      </Router>
    </Provider>
  </ThemeProvider>,
  document.getElementById('root') as HTMLElement,
);

ServiceWorker.register();
export * from 'services';
export * from 'stores';
export * from 'theme';
export * from './services';
export * from './stores';
export * from './theme';
