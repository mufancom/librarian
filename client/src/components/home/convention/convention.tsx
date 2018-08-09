import {Col, Layout, Row} from 'antd';
import classNames from 'classnames';
import * as React from 'react';
import {Route, RouteComponentProps, Switch, withRouter} from 'react-router';
import styled from 'styled-components';

import {ConventionService} from 'services/convention-service';
import {RouterStore} from 'stores/router-store';
import {inject, observer} from 'utils/mobx';
import {RouteTrackerWithRouter} from '../../common/TrackingRoute';
import {ConventionBody} from './@convention-body';
import {ConventionSideNavWithRouter} from './@convention-side-nav';
import {ConventionSideSearch} from './@convention-side-search';

const {Content, Sider} = Layout;

const Wrapper = styled.div`
  ${ConventionSideSearch.Wrapper} {
    margin-left: 26px;
    margin-top: 27px;
  }
`;

interface ConventionProps extends RouteComponentProps<any> {
  className?: string;
}

@observer
export class Convention extends React.Component<ConventionProps> {
  @inject
  routerStore!: RouterStore;

  @inject
  conventionService!: ConventionService;

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
                width={230}
              >
                <ConventionSideSearch />
                <ConventionSideNavWithRouter />
              </Sider>
              <Content
                style={{
                  margin: '0 16px 0 300px',
                  overflow: 'auto',
                  padding: 0,
                }}
              >
                <Switch>
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
                    path="/convention/:category/:item"
                    component={(props: any) => (
                      <RouteTrackerWithRouter
                        {...props}
                        onChange={this.onRouteChange}
                      >
                        <ConventionBody {...props} />
                      </RouteTrackerWithRouter>
                    )}
                  />
                  <Route>
                    <div>Miss at {this.routerStore.location.pathname}</div>
                  </Route>
                </Switch>
              </Content>
            </Layout>
          </Col>
        </Row>
      </Wrapper>
    );
  }

  onRouteChange = (match: any) => {
    // tslint:disable-next-line:no-console
    let {category, group, item} = match.params;

    let path = `${category}/${group ? `${group}/` : ''}${item}`;
    this.conventionService.load(path).catch();

    scrollTo(0, 0);
  };

  static Wrapper = Wrapper;
}

export const ConventionWithRouter = withRouter(Convention);
