import {Layout} from 'antd';
import classNames from 'classnames';
import {action, observable} from 'mobx';
import React, {Component} from 'react';
import {RouteComponentProps, withRouter} from 'react-router';

import {Direction, ScrollService} from 'services/scroll-service';
import {styled} from 'theme';
import {inject, observer} from 'utils/mobx';

import {HeaderWithRouter} from './header';

const {Header} = Layout;

const Wrapper = styled.div`
  @keyframes headerHintBarAppear {
    0% {
      border-bottom-width: 0px;
    }

    60% {
      border-bottom-width: 0px;
    }

    100% {
      border-bottom-width: 3px;
    }
  }

  .ant-layout-header {
    background: ${props => props.theme.light};
    padding: 0 10px;
    position: fixed;
    height: 90px;
    left: 0;
    right: -20px;
    z-index: 999;
    display: block;
    transition: all 0.3s;

    &.hide {
      transform: translateY(-91px);
      transition: all 0.3s;

      .header-nav.header-nav-with-hint-bar {
        border-bottom: 3px solid ${props => props.theme.accent()};
        animation: headerHintBarAppear 0.3s;
      }
    }
  }
`;

export interface HeaderLayoutProps extends RouteComponentProps<any> {
  className?: string;
}

@observer
export class HeaderLayout extends Component<HeaderLayoutProps> {
  @inject
  scrollService!: ScrollService;

  @observable
  hideHeader = false;

  scrollListenerId!: number;

  hideTimer: any;

  componentDidMount(): void {
    this.scrollListenerId = this.scrollService.addListener(this.onWindowScroll);
  }

  componentWillUnmount(): void {
    this.scrollService.removeListener(this.scrollListenerId);
  }

  render(): JSX.Element {
    let {className} = this.props;

    return (
      <Wrapper className={classNames('header-layout', className)}>
        <Header className={this.hideHeader ? 'hide' : undefined}>
          <HeaderWithRouter />
        </Header>
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
      this.setHeaderHidden(true);
    } else if (direction === Direction.up) {
      this.setHeaderHidden(false);
    }
  };

  @action
  setHeaderHidden(hide: boolean): void {
    if (!this.hideTimer) {
      setTimeout(() => {
        this.hideHeader = hide;
      }, 100);
    }
  }

  static Wrapper = Wrapper;
}

export const HeaderLayoutWithRouter = withRouter(HeaderLayout);
