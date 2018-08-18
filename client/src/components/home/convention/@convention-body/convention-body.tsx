import {message} from 'antd';
import classNames from 'classnames';
import {action, observable} from 'mobx';
import React, {Component, createRef} from 'react';
import ReactDOM from 'react-dom';
import {RouteComponentProps, withRouter} from 'react-router';
import scrollIntoView from 'scroll-into-view-if-needed';

import {fetchErrorMessage} from 'services/api-service';
import {ConventionService} from 'services/convention-service';
import {AuthStore} from 'stores/auth-store';
import {ConventionStore} from 'stores/convention-store';
import {RouterStore} from 'stores/router-store';
import {styled} from 'theme';
import {inject, observer} from 'utils/mobx';

import {MarkdownStyle} from '../../../common';

import {ConventionBodyItem} from './@convention-body-item';
import {ConventionBodyItemCreate} from './@convention-body-item-create';
import {ConventionBodyTitle} from './@convention-body-title';

const Wrapper = styled(MarkdownStyle)`
  padding-top: 25px;
  padding-bottom: 20px;
`;

export interface ConventionBodyProps extends RouteComponentProps<any> {
  className?: string;
}

@observer
export class ConventionBody extends Component<ConventionBodyProps> {
  @inject
  authStore!: AuthStore;

  @inject
  routerStore!: RouterStore;

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

    return (
      <Wrapper
        className={classNames('convention-body', className, 'markdown-body')}
      >
        <ConventionBodyTitle
          {...this.props}
          onAddConventionButtonClick={this.onAddConventionButtonClick}
        />
        {this.conventionStore.currentContent.map(value => {
          return <ConventionBodyItem key={value.id} item={value} />;
        })}
        <ConventionBodyItemCreate
          ref={this.itemCreateRef}
          show={this.showCreateConvention && this.authStore.isLoggedIn}
          onCancelClick={this.onCancelClick}
          onOkClick={this.onOkClick}
          loading={this.createConventionLoading}
        />
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
