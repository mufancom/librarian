import {Layout} from 'antd';
import classNames from 'classnames';
import {action, observable} from 'mobx';
import React, {Component} from 'react';
import {RouteComponentProps, withRouter} from 'react-router';

import {Direction, ScrollService} from 'services/scroll-service';
import {styled} from 'theme';
import {inject, observer} from 'utils/mobx';

import {ConventionSideNavWithRouter} from './@convention-side-nav';
import {ConventionSideSearch} from './@convention-side-search';

const {Sider} = Layout;

const Wrapper = styled.div`
  ${ConventionSideSearch.Wrapper} {
    margin-left: 36px;
    margin-top: 24px;
  }

  .nav-sider {
    top: 88px;
    transition: all 0.3s;

    &.pull-up {
      transform: translateY(-60px);
      transition: all 0.3s;
    }
  }
`;

export interface ConventionSiderLayoutProps extends RouteComponentProps<any> {
  className?: string;
}

@observer
export class ConventionSiderLayout extends Component<
  ConventionSiderLayoutProps
> {
  @inject
  scrollService!: ScrollService;

  @observable
  pullUp = false;

  scrollListenerId!: number;

  componentDidMount(): void {
    this.scrollListenerId = this.scrollService.addListener(this.onWindowScroll);
  }

  componentWillUnmount(): void {
    this.scrollService.removeListener(this.scrollListenerId);
  }

  render(): JSX.Element {
    let {className} = this.props;

    return (
      <Wrapper className={classNames('convention-sider-layout', className)}>
        <Sider
          className={`nav-sider${this.pullUp ? ' pull-up' : ''}`}
          style={{
            backgroundColor: '#fff',
            bottom: '-20px',
            position: 'fixed',
            overflow: 'auto',
            zIndex: 50,
            paddingRight: '10px',
          }}
          width={250}
        >
          <ConventionSideSearch />
          <ConventionSideNavWithRouter />
        </Sider>
      </Wrapper>
    );
  }

  @action
  onWindowScroll = (
    _scrollY: number,
    direction: Direction,
    lastingLength: number,
  ): void => {
    if (direction === Direction.down && lastingLength > 100) {
      this.pullUp = true;
    } else if (direction === Direction.up) {
      this.pullUp = false;
    }
  };

  static Wrapper = Wrapper;
}

export const ConventionSiderLayoutWithRouter = withRouter(
  ConventionSiderLayout,
);
