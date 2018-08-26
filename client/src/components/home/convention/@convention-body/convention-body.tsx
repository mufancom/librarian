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

const Wrapper = styled(MarkdownStyle)`
  padding-bottom: 20px;

  .anchor {
    position: fixed;
    top: 100px;
    overflow-y: hidden;

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

interface HeadingAnchorProps {
  headings: Heading[];
}

function formAnchorLinks(tree: Heading[]): React.ReactNode {
  return tree.map(val => (
    <Link
      key={val.level + val.id}
      href={`#${val.id}`}
      title={val.text}
      children={formAnchorLinks(val.children)}
    />
  ));
}

const HeadingAnchor: React.SFC<HeadingAnchorProps> = props => {
  return (
    <Anchor
      affix={false}
      className="anchor"
      offsetTop={100}
      style={{marginLeft: '20px'}}
      showInkInFixed={true}
      children={formAnchorLinks(props.headings)}
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

  @observable
  showCreateConvention = false;

  @observable
  createConventionLoading = false;

  itemCreateRef: React.RefObject<ConventionBodyItemCreate> = createRef();

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
            <HeadingAnchor headings={headings} />
          </Sider>
        </Layout>
      </Wrapper>
    );
  }

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
  onOkClick = async (content: string): Promise<void> => {
    let {currentConvention} = this.conventionStore;

    this.createConventionLoading = true;

    try {
      await this.conventionService.createConventionItem(
        currentConvention!.id,
        content,
      );

      message.success('添加条目成功！');

      this.showCreateConvention = false;
    } catch (error) {
      let errorMessage = fetchErrorMessage(error);

      message.error(errorMessage);
    }

    this.createConventionLoading = false;
  };

  static Wrapper = Wrapper;
}

export const ConventionBodyWithRouter = withRouter(ConventionBody);
