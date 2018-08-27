import {Pagination, Timeline} from 'antd';
import classNames from 'classnames';
import React, {Component} from 'react';

import {ConventionService} from 'services/convention-service';
import {UserService} from 'services/user-service';
import {ConventionStore, ITEM_VERSION_PAGE_SIZE} from 'stores/convention-store';
import {RouterStore} from 'stores/router-store';
import {styled} from 'theme';
import {inject, observer} from 'utils/mobx';

import {ConventionVersionItem} from './@convention-version-item';
import {ConventionVersionsHeader} from './@convention-versions-header';

const Wrapper = styled.div`
  padding: 10px 40px;
  margin-bottom: 30px;

  .ant-timeline-item {
    padding: 0 !important;
    animation: fadeUpIn 0.5s;

    &:nth-last-child(2) {
      .ant-timeline-item-tail {
        height: auto;
        bottom: 2px;
      }
    }
  }
`;

const DateTitle = styled.div``;

const PaginationContainer = styled.div`
  margin-top: 30px;
  animation: fadeUpIn 0.65s;
`;

export interface ConventionVersionsProps {
  className?: string;
}

@observer
export class ConventionVersions extends Component<ConventionVersionsProps> {
  @inject
  routerStore!: RouterStore;

  @inject
  conventionStore!: ConventionStore;

  @inject
  conventionService!: ConventionService;

  @inject
  userService!: UserService;

  savedItemId: number = 0;

  render(): JSX.Element {
    let {className} = this.props;

    let {
      versionGroups,
      versionPageCount,
      currentVersionPage,
    } = this.conventionStore;

    return (
      <Wrapper className={classNames('convention-versions', className)}>
        <ConventionVersionsHeader />
        <Timeline>
          {versionGroups.map(group => (
            <Timeline.Item key={group.date}>
              <DateTitle>{group.date}</DateTitle>
              {group.children.map(itemVersionWithUserInfo => (
                <ConventionVersionItem
                  key={itemVersionWithUserInfo.itemVersion.id}
                  item={itemVersionWithUserInfo}
                />
              ))}
            </Timeline.Item>
          ))}
          <Timeline.Item style={{display: 'none'}} />
        </Timeline>
        {versionGroups.length ? (
          <PaginationContainer>
            <Pagination
              current={currentVersionPage}
              defaultPageSize={ITEM_VERSION_PAGE_SIZE}
              total={versionPageCount * ITEM_VERSION_PAGE_SIZE}
              onChange={this.onPaginationChange}
            />
          </PaginationContainer>
        ) : (
          undefined
        )}
      </Wrapper>
    );
  }

  onPaginationChange = (page: number): void => {
    this.routerStore.push(`?page=${page}`);
  };

  static Wrapper = Wrapper;
}
