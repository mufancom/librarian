import {Breadcrumb} from 'antd';
import classNames from 'classnames';
import {action, observable} from 'mobx';
import React, {Component} from 'react';
import {NavLink} from 'react-router-dom';

import {ConventionService} from 'services/convention-service';
import {ConventionItem, ConventionStore} from 'stores/convention-store';
import {RouterStore} from 'stores/router-store';
import {styled} from 'theme';
import {inject, observer} from 'utils/mobx';
import {getMarkdownTitle} from 'utils/regex';

const Wrapper = styled.div`
  .ant-breadcrumb-link {
    animation: fadeIn 0.5s;
  }
`;

const Title = styled.div`
  margin-top: 20px;
  margin-bottom: 30px;
  font-size: 24px;
`;

export interface ConventionVersionsHeaderProps {
  className?: string;
}

@observer
export class ConventionVersionsHeader extends Component<
  ConventionVersionsHeaderProps
> {
  @inject
  routerStore!: RouterStore;

  @inject
  conventionStore!: ConventionStore;

  @inject
  conventionService!: ConventionService;

  @observable
  conventionPath: string | undefined;

  @observable
  conventionItem: ConventionItem | undefined;

  savedItemId: number = 0;

  render(): JSX.Element {
    let {className} = this.props;

    let convention = this.conventionStore.currentVersionConvention;

    let itemId = this.conventionStore.currentConventionItemId;

    let {title: conventionTitle} = convention
      ? convention
      : {title: 'Loading...'};

    let {conventionPath, conventionItem} = this;

    this.listenToItemId(itemId).catch();

    return (
      <Wrapper className={classNames('convention-versions-header', className)}>
        <Breadcrumb>
          <Breadcrumb.Item>
            <NavLink to="/convention">规范</NavLink>
          </Breadcrumb.Item>
          {convention ? (
            <Breadcrumb.Item>
              <NavLink to={`/convention/${conventionPath}`}>
                {conventionTitle}
              </NavLink>
            </Breadcrumb.Item>
          ) : (
            undefined
          )}
          {conventionItem ? (
            <Breadcrumb.Item>
              {conventionItem
                ? getMarkdownTitle(
                    conventionItem.content,
                    `#${conventionItem.id}`,
                  )
                : 'Loading...'}
            </Breadcrumb.Item>
          ) : (
            undefined
          )}
        </Breadcrumb>
        <Title>历史版本</Title>
      </Wrapper>
    );
  }

  listenToItemId = async (itemId: number): Promise<void> => {
    if (this.savedItemId !== itemId) {
      await this.initHeader();

      this.savedItemId = itemId;
    }
  };

  @action
  initHeader = async (): Promise<void> => {
    let convention = this.conventionStore.currentVersionConvention!;

    let {currentConventionItemId} = this.conventionStore;

    this.conventionPath = await this.conventionService.getPathByConvention(
      convention,
    );

    this.conventionItem = await this.conventionService.getConventionItem(
      currentConventionItemId,
    );
  };

  static Wrapper = Wrapper;
}
