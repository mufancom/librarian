import {Col, Layout, Row} from 'antd';
import classNames from 'classnames';
import * as React from 'react';
import {Route, RouteComponentProps, Switch, withRouter} from 'react-router';
import styled from 'styled-components';

import {ConventionService} from 'services/convention-service';
import {ConventionStore} from 'stores/convention-store';
import {RouterStore} from 'stores/router-store';
import {inject, observer} from 'utils/mobx';

import {RouteTrackerWithRouter} from '../../common/TrackingRoute';

import {ConventionBody} from './@convention-body';
import {ConventionIndex} from './@convention-index';
import {ConventionSideSearch} from './@convention-side-search';
import {ConventionSiderLayoutWithRouter} from './@convention-sider-layout';

const {Content} = Layout;

const Wrapper = styled.div`
  ${ConventionSideSearch.Wrapper} {
    margin-left: 26px;
    margin-top: 27px;
  }
`;

interface ConventionProps extends RouteComponentProps<any> {
  className?: string;
}

interface RouteIdMatchParams {
  id: number;
}

interface RouteThreeLevelParams {
  category: string;
  group: string;
  item: string;
}

interface RouteTwoLevelParams {
  category: string;
  group: '-';
  item: string;
}

type RouteParams =
  | RouteIdMatchParams
  | RouteThreeLevelParams
  | RouteTwoLevelParams;

function isRouteIdMatchParams(
  params: RouteParams,
): params is RouteIdMatchParams {
  return 'id' in params;
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
            className="header-nav"
          >
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
      let path;

      let {category, group, item} = params;

      path = `${category}/${group}/${item}/`;

      let convention = await this.conventionService.getConventionByPath(path);

      if (convention) {
        id = convention.id;
      }
    }

    // tslint:disable-next-line:no-console
    this.conventionService.load(id).catch(console.log);

    scrollTo(0, 0);
  };

  static Wrapper = Wrapper;
}

export const ConventionWithRouter = withRouter(Convention);
