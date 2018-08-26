import {Breadcrumb} from 'antd';
import classNames from 'classnames';
import React, {Component} from 'react';
import {NavLink} from 'react-router-dom';

import {ConventionService} from 'services/convention-service';
import {ConventionStore} from 'stores/convention-store';
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

  render(): JSX.Element {
    let {className} = this.props;

    let {
      currentVersionConvention: convention,
      currentVersionConventionItem: conventionItem,
      currentVersionConventionPath: conventionPath,
    } = this.conventionStore;

    let conventionTitle = 'Loading...';

    let conventionItemTitle = 'Loading...';

    if (convention && conventionItem) {
      conventionTitle = convention.title;

      conventionItemTitle = getMarkdownTitle(
        conventionItem.content,
        `#${conventionItem.id}`,
      );
    }

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
            <Breadcrumb.Item>{conventionItemTitle}</Breadcrumb.Item>
          ) : (
            undefined
          )}
        </Breadcrumb>
        <Title>历史版本</Title>
      </Wrapper>
    );
  }

  static Wrapper = Wrapper;
}
