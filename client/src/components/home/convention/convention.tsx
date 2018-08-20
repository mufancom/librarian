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

@observer
export class Convention extends React.Component<ConventionProps> {
  @inject
  routerStore!: RouterStore;

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
                    path="/convention/:id(\d+)"
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

  onRouteChange = (match: any): void => {
    let {id} = match.params;

    // tslint:disable-next-line:no-console
    this.conventionService.load(id).catch(console.log);

    scrollTo(0, 0);
  };

  static Wrapper = Wrapper;
}

export const ConventionWithRouter = withRouter(Convention);
