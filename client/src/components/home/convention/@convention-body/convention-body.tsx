import {Anchor, Layout, message} from 'antd';
import classNames from 'classnames';
import {action, observable} from 'mobx';
import React, {Component, createRef} from 'react';
import ReactDOM from 'react-dom';
import FlipMove from 'react-flip-move';
import {RouteComponentProps, withRouter} from 'react-router';
import scrollIntoView from 'scroll-into-view-if-needed';

import {fetchErrorMessage} from 'services/api-service';
import {ConventionService} from 'services/convention-service';
import {ScrollService} from 'services/scroll-service';
import {AuthStore} from 'stores/auth-store';
import {ConventionStore} from 'stores/convention-store';
import {styled} from 'theme';
import {fadeInUpAnimation} from 'utils/dom';
import {Heading} from 'utils/markdown';
import {inject, observer} from 'utils/mobx';

import {MarkdownStyle} from '../../../common';

import {ConventionBodyItem} from './@convention-body-item';
import {ConventionBodyItemCreate} from './@convention-body-item-create';
import {ConventionBodyTitle} from './@convention-body-title';

const {Sider, Content} = Layout;

const {Link} = Anchor;

const ANCHOR_INITIAL_TOP = 130;
const ANCHOR_BOUNDING_BOTTOM = 130;

const Wrapper = styled(MarkdownStyle)`
  padding-bottom: 20px;

  .anchor {
    position: fixed;
    overflow-y: hidden;
    transition: all 0.3s;
    transform: translateX(0);

    a {
      text-decoration: none;
      color: ${props => props.theme.text.navSecondary};
      transition: all 0.3s;

      &:hover {
        color: ${props => props.theme.accent()};
        transition: all 0.3s;
      }

      &.ant-anchor-link-title-active {
        color: ${props => props.theme.accent()};
        transition: all 0.1s;
      }
    }

    .ant-anchor-link {
      line-height: 1.07;
    }

    .ant-anchor-link .ant-anchor-link {
      padding-left: 8px;
    }

    .ant-anchor > .ant-anchor-link > a {
      color: ${props => props.theme.text.navPrimary};

      &:hover {
        color: ${props => props.theme.accent()};
        transition: all 0.3s;
      }

      &.ant-anchor-link-title-active {
        color: ${props => props.theme.accent()};
        transition: all 0.1s;
      }
    }
  }
`;

function formAnchorLinks(tree: Heading[]): React.ReactNode {
  return tree.map(val => (
    <Link
      key={val.level + val.id}
      href={`#${val.id}`}
      title={decodeURIComponent(val.id)}
      children={formAnchorLinks(val.children)}
    />
  ));
}

interface HeadingAnchorProps {
  opacity: number;
  headings: Heading[];
  top: number;
}

const HeadingAnchor: React.SFC<HeadingAnchorProps> = props => {
  let {opacity, headings, top} = props;

  return (
    <Anchor
      affix={false}
      className="anchor"
      style={{marginLeft: '20px', opacity, transition: 'all .5s', top}}
      showInkInFixed={true}
      children={formAnchorLinks(headings)}
    />
  );
};

export interface ConventionBodyProps extends RouteComponentProps<any> {
  className?: string;
}

@observer
export class ConventionBody extends Component<ConventionBodyProps> {
  @inject
  authStore!: AuthStore;

  @inject
  conventionStore!: ConventionStore;

  @inject
  conventionService!: ConventionService;

  @inject
  scrollService!: ScrollService;

  @observable
  showCreateConvention = false;

  @observable
  createConventionLoading = false;

  @observable
  fadeAnchor = true;

  @observable
  anchorTop = ANCHOR_INITIAL_TOP;

  listenerId!: number;

  itemCreateRef: React.RefObject<ConventionBodyItemCreate> = createRef();

  componentWillMount(): void {
    this.onWindowScroll(window.scrollY);
  }

  componentDidMount(): void {
    this.listenerId = this.scrollService.addListener(this.onWindowScroll);
  }

  componentWillUnmount(): void {
    this.scrollService.removeListener(this.listenerId);
  }

  render(): JSX.Element {
    let {className} = this.props;

    let {currentContent: content} = this.conventionStore;

    let items = content ? content.items : [];

    let headings = content ? content.headings : [];

    return (
      <Wrapper
        className={classNames('convention-body', className, 'markdown-body')}
      >
        <Layout>
          <Content style={{overflowY: 'hidden'}}>
            <ConventionBodyTitle
              {...this.props}
              onAddConventionButtonClick={this.onAddConventionButtonClick}
            />
            <FlipMove
              enterAnimation={fadeInUpAnimation}
              leaveAnimation="none"
              delay="50"
            >
              {items.map(value => {
                return <ConventionBodyItem key={value.id} item={value} />;
              })}
            </FlipMove>
            <ConventionBodyItemCreate
              ref={this.itemCreateRef}
              show={this.showCreateConvention && this.authStore.isLoggedIn}
              onCancelClick={this.onCancelClick}
              onOkClick={this.onOkClick}
              loading={this.createConventionLoading}
            />
          </Content>
          <Sider
            width="300px"
            style={{
              background: 'transparent',
              marginLeft: '20px',
            }}
          >
            <HeadingAnchor
              opacity={this.fadeAnchor ? 0.3 : 1}
              headings={headings}
              top={this.anchorTop}
            />
          </Sider>
        </Layout>
      </Wrapper>
    );
  }

  @action
  onWindowScroll = (scrollTop: number): void => {
    if (scrollTop > 100) {
      this.fadeAnchor = false;
    } else {
      this.fadeAnchor = true;
    }

    this.adjustAnchor();
  };

  @action
  onAddConventionButtonClick = (): void => {
    this.showCreateConvention = true;

    let createDom = ReactDOM.findDOMNode(
      this.itemCreateRef.current!,
    ) as HTMLDivElement;

    setTimeout(() => {
      scrollIntoView(createDom, {
        behavior: 'smooth',
        scrollMode: 'if-needed',
      });
    }, 100);
  };

  @action
  onCancelClick = (): void => {
    this.showCreateConvention = false;
  };

  @action
  onOkClick = async (content: string, commitMessage: string): Promise<void> => {
    let {currentConvention} = this.conventionStore;

    this.createConventionLoading = true;

    try {
      await this.conventionService.createConventionItem(
        currentConvention!.id,
        content,
        commitMessage,
      );

      message.success('添加条目成功！');

      this.showCreateConvention = false;
    } catch (error) {
      let errorMessage = fetchErrorMessage(error);

      message.error(errorMessage);
    }

    this.createConventionLoading = false;
  };

  @action
  adjustAnchor = (): void => {
    let anchorElements = document.getElementsByClassName('anchor');

    let activeElements = document.getElementsByClassName(
      'ant-anchor-link-title-active',
    );

    if (activeElements.length && anchorElements.length) {
      let anchorElement = anchorElements[0] as HTMLDivElement;

      let activeElement = activeElements[0] as HTMLAnchorElement;

      let {top: anchorTop} = anchorElement.getBoundingClientRect();

      let {top: activeItemTop} = activeElement.getBoundingClientRect();

      let activeItemPositionYInAnchor = activeItemTop - anchorTop;

      let assumedActiveItemTopIfNotScrolled =
        ANCHOR_INITIAL_TOP + activeItemPositionYInAnchor;

      let {innerHeight: windowHeight} = window;

      let boundingBottom = windowHeight - ANCHOR_BOUNDING_BOTTOM;

      if (assumedActiveItemTopIfNotScrolled > boundingBottom - 20) {
        this.anchorTop =
          windowHeight -
          ANCHOR_BOUNDING_BOTTOM -
          20 -
          activeItemPositionYInAnchor;
      } else {
        this.anchorTop = ANCHOR_INITIAL_TOP;
      }
    }
  };

  static Wrapper = Wrapper;
}

export const ConventionBodyWithRouter = withRouter(ConventionBody);
