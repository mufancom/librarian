import {Col, Layout, Row} from 'antd';
import classNames from 'classnames';
import * as QueryString from 'query-string';
import * as React from 'react';
import {Route, RouteComponentProps, Switch, withRouter} from 'react-router';
import styled from 'styled-components';

import {
  ConventionService,
  RouteParams,
  VersionsRouteParams,
  isRouteIdMatchParams,
} from 'services/convention-service';
import {ConventionStore} from 'stores/convention-store';
import {RouterStore} from 'stores/router-store';
import {inject, observer} from 'utils/mobx';

import {RouteTrackerWithRouter} from '../../common/TrackingRoute';

import {ConventionBody} from './@convention-body';
import {ConventionIndex} from './@convention-index';
import {ConventionSideSearch} from './@convention-side-search';
import {ConventionSiderLayoutWithRouter} from './@convention-sider-layout';
import {ConventionVersions} from './@convention-versions/convention-versions';

const {Content} = Layout;

const Wrapper = styled.div`
  ${ConventionSideSearch.Wrapper} {
    margin-left: 26px;
    margin-top: 27px;
  }
`;

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
        <Row>
          <Col
            xs={{span: 24, offset: 0}}
            sm={{span: 22, offset: 1}}
            md={{span: 20, offset: 2}}
            lg={{span: 18, offset: 3}}
            xl={{span: 16, offset: 4}}
          >
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
                            onChange={this.onRouteChange}
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
                      <Route>
                        <div>
                          Miss at {this.routerStore.location.pathname} <br />
                          (TODO: 404 {'>_<'})
                        </div>
                      </Route>
                    </Switch>
                  </Content>
                </Layout>
              </Route>
            </Switch>
          </Col>
        </Row>
      </Wrapper>
    );
  }

  onRouteChange = async (match: any): Promise<void> => {
    let params = match.params as RouteParams;

    let id = 0;

    if (isRouteIdMatchParams(params)) {
      id = params.id;
    } else {
      let convention = await this.conventionService.getConventionByPathParams(
        params,
      );

      if (convention) {
        id = convention.id;
      }
    }

    await this.conventionService.load(id);

    scrollTo(0, 0);
  };

  onRouteChangeToVersions = async (match: any): Promise<void> => {
    let params = match.params as VersionsRouteParams;

    let {page} = QueryString.parse(
      this.routerStore.location.search,
    ) as ConventionVersionQueries;

    let pageNum = page ? parseInt(page) : 1;

    await this.conventionService.loadVersions(params, pageNum);

    scrollTo(0, 0);
  };

  static Wrapper = Wrapper;
}

export const ConventionWithRouter = withRouter(Convention);
