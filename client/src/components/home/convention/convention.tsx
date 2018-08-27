import {Layout} from 'antd';
import classNames from 'classnames';
import * as QueryString from 'query-string';
import * as React from 'react';
import {Route, RouteComponentProps, Switch, withRouter} from 'react-router';
import styled from 'styled-components';

import {
  ConventionService,
  RouteAliasParams,
  RouteIdMatchParams,
  VersionsRouteParams,
} from 'services/convention-service';
import {ConventionStore} from 'stores/convention-store';
import {RouterStore} from 'stores/router-store';
import {doneProgress, startProgress} from 'utils/dom';
import {inject, observer} from 'utils/mobx';

import {RouteTrackerWithRouter} from '../../common/TrackingRoute';

import {ConventionBody} from './@convention-body';
import {ConventionIndex} from './@convention-index';
import {ConventionSiderLayoutWithRouter} from './@convention-sider-layout';
import {ConventionVersions} from './@convention-versions/convention-versions';

const {Content} = Layout;

const Wrapper = styled.div``;

export interface ConventionVersionQueries {
  page?: string;
}

interface ConventionProps extends RouteComponentProps<any> {
  className?: string;
}

@observer
export class Convention extends React.Component<ConventionProps> {
  @inject
  routerStore!: RouterStore;

  @inject
  conventionStore!: ConventionStore;

  @inject
  conventionService!: ConventionService;

  render(): JSX.Element {
    let {className} = this.props;

    return (
      <Wrapper className={classNames('convention', className)}>
        <Switch>
          <Route
            path="/convention/:category/:group/:item/:itemId(\d+)/versions"
            component={(props: any) => (
              <RouteTrackerWithRouter
                {...props}
                onChange={this.onRouteChangeToVersions}
              >
                <ConventionVersions />
              </RouteTrackerWithRouter>
            )}
          />
          <Route>
            <Layout>
              <ConventionSiderLayoutWithRouter />
              <Content
                style={{
                  margin: '0 16px 0 300px',
                  padding: 0,
                  overflow: 'visible',
                }}
              >
                <Switch>
                  <Route
                    path="/convention/:id(\d+)/:category/:group/:item"
                    component={(props: any) => (
                      <RouteTrackerWithRouter
                        {...props}
                        onChange={this.onRouteChangeWithIdParam}
                      >
                        <ConventionBody {...props} />
                      </RouteTrackerWithRouter>
                    )}
                  />
                  <Route
                    path="/convention/:category/:group/:item"
                    component={(props: any) => (
                      <RouteTrackerWithRouter
                        {...props}
                        onChange={this.onRouteChange}
                      >
                        <ConventionBody {...props} />
                      </RouteTrackerWithRouter>
                    )}
                  />
                  <Route
                    exact={true}
                    path="/convention/"
                    component={ConventionIndex}
                  />
                  <Route exact={true} path="/convention/f-o-f">
                    <div>
                      Miss at {this.routerStore.location.pathname} <br />
                      (TODO: 404 {'>_<'})
                    </div>
                  </Route>
                  <Route
                    component={(props: any) => (
                      <RouteTrackerWithRouter
                        {...props}
                        onChange={this.onRouteChangeMiss}
                      >
                        <div />
                      </RouteTrackerWithRouter>
                    )}
                  />
                </Switch>
              </Content>
            </Layout>
          </Route>
        </Switch>
      </Wrapper>
    );
  }

  onRouteChangeWithIdParam = async (match: any): Promise<void> => {
    let {id, category, group, item} = match.params as RouteIdMatchParams &
      RouteAliasParams;

    let convention = await this.conventionService.getConvention(id);

    if (convention) {
      let oldPath = `/convention/${id}/${category}/${group}/${item}`;

      let newPath = await this.conventionService.getPathByConvention(
        convention,
      );

      let nowFullPath = this.routerStore.location.pathname;

      let payload = nowFullPath.slice(oldPath.length);

      let {hash, search} = this.routerStore.location;

      let newFullPath = `/convention/${newPath}${payload}${hash}${search}`;

      this.routerStore.push(newFullPath);
    } else {
      this.routerStore.push('/convention/f-o-f');
    }
  };

  onRouteChange = async (match: any): Promise<void> => {
    let params = match.params as RouteAliasParams;

    let id = 0;

    let convention = await this.conventionService.getConventionByPathParams(
      params,
    );

    if (convention) {
      id = convention.id;

      let {currentConvention} = this.conventionStore;

      let lastConventionId = currentConvention
        ? currentConvention.id
        : undefined;

      if (!lastConventionId || lastConventionId !== id) {
        startProgress();
      }

      await this.conventionService.load(id);

      if (!lastConventionId || lastConventionId !== id) {
        doneProgress();
        scrollTo(0, 0);
      }
    } else {
      this.routerStore.push('/convention/f-o-f');
    }
  };

  onRouteChangeToVersions = async (match: any): Promise<void> => {
    startProgress();

    let params = match.params as VersionsRouteParams;

    let {page} = QueryString.parse(
      this.routerStore.location.search,
    ) as ConventionVersionQueries;

    let pageNum = page ? parseInt(page) : 1;

    await this.conventionService.loadVersions(params, pageNum);

    scrollTo(0, 0);

    doneProgress();
  };

  onRouteChangeMiss = (): void => {
    this.routerStore.push('/convention/f-o-f');
  };

  static Wrapper = Wrapper;
}

export const ConventionWithRouter = withRouter(Convention);
