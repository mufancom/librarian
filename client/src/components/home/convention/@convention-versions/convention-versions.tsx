import {Avatar, Button, Card, Pagination, Timeline} from 'antd';
import classNames from 'classnames';
import {action, observable} from 'mobx';
import * as QueryString from 'query-string';
import React, {Component} from 'react';

import {ConventionService} from 'services/convention-service';
import {ConventionItemVersion, ConventionStore} from 'stores/convention-store';
import {RouterStore} from 'stores/router-store';
import {styled} from 'theme';
import {formatAsTimeAgo} from 'utils/date';
import {inject, observer} from 'utils/mobx';

import {ConventionVersionsHeader} from './@convention-versions-header';

const ButtonGroup = Button.Group;

export const ITEM_VERSION_PAGE_SIZE = 20;

const Wrapper = styled.div`
  padding: 10px 40px;
  margin-bottom: 30px;

  .timeline {
    animation: fadeUpIn 0.5s;
  }

  .ant-timeline-item {
    padding: 0 !important;

    &:nth-last-child(2) {
      .ant-timeline-item-tail {
        height: auto;
        bottom: 2px;
      }
    }

    .ant-card {
      margin-top: 8px;
      padding: 6px 8px;
      position: relative;
      border-radius: 3px;

      &:hover {
        background-color: #f8f9fa;
      }

      &:last-child {
        margin-bottom: 15px;
      }

      .ant-card-body {
        padding: 4px 8px !important;
      }
    }
  }
`;

const DateTitle = styled.div``;

const CardLeftSide = styled.div`
  float: left;
`;

const CardTitle = styled.div`
  font-size: 15px;
`;

const CardSubtitle = styled.div`
  margin-top: 6px;
  font-size: 12px;
  color: ${props => props.theme.text.secondary};

  .ant-avatar {
    margin-top: -2px;
    margin-right: 2px;

    & > * {
      line-height: 17px;
    }
  }
`;

const CardRightSide = styled.div`
  float: right;

  .ant-btn-group {
    display: inline;
  }
`;

const PaginationContainer = styled.div`
  margin-top: 30px;
  animation: fadeUpIn 0.65s;
`;

export interface ItemVersionGroup {
  date: string;
  children: ConventionItemVersion[];
}

export interface ConventionVersionsProps {
  className?: string;
}

export interface ConventionVersionQueries {
  page?: string;
}

@observer
export class ConventionVersions extends Component<ConventionVersionsProps> {
  @inject
  routerStore!: RouterStore;

  @inject
  conventionStore!: ConventionStore;

  @inject
  conventionService!: ConventionService;

  @observable
  versionGroups: ItemVersionGroup[] = [];

  @observable
  pageCount: number = 1;

  savedItemId: number = 0;

  render(): JSX.Element {
    let {className} = this.props;

    let {page} = QueryString.parse(
      this.routerStore.location.search,
    ) as ConventionVersionQueries;

    let pageNum = page ? parseInt(page) : 1;

    let conventionItemId = this.conventionStore.currentConventionItemId;

    this.listenToItemId(conventionItemId).catch();

    return (
      <Wrapper className={classNames('convention-versions', className)}>
        <ConventionVersionsHeader />
        <Timeline className="timeline">
          {this.versionGroups.map(group => (
            <Timeline.Item key={group.date}>
              <DateTitle>{group.date}</DateTitle>
              {group.children.map(itemVersion => {
                let {id, message, hash, createdAt, fromId} = itemVersion;

                if (fromId) {
                  message = message ? message : `#${id} 编辑`;
                } else {
                  message = message ? message : `首次添加`;
                }

                return (
                  <Card key={itemVersion.id}>
                    <CardLeftSide>
                      <CardTitle>{message}</CardTitle>
                      <CardSubtitle>
                        <Avatar size={17} icon="user" /> Dizy 提交于&nbsp;
                        {formatAsTimeAgo(createdAt)}
                      </CardSubtitle>
                    </CardLeftSide>
                    <CardRightSide>
                      <ButtonGroup>
                        <Button icon="copy" />
                        <Button style={{width: '82px'}}>
                          {hash.slice(0, 7)}
                        </Button>
                      </ButtonGroup>
                    </CardRightSide>
                  </Card>
                );
              })}
            </Timeline.Item>
          ))}
          <Timeline.Item style={{display: 'none'}} />
        </Timeline>
        {this.versionGroups.length ? (
          <PaginationContainer>
            <Pagination
              current={pageNum}
              defaultPageSize={ITEM_VERSION_PAGE_SIZE}
              total={this.pageCount * ITEM_VERSION_PAGE_SIZE}
              onChange={this.onPaginationChange}
            />
          </PaginationContainer>
        ) : (
          undefined
        )}
      </Wrapper>
    );
  }

  listenToItemId = async (itemId: number): Promise<void> => {
    let {page} = QueryString.parse(
      this.routerStore.location.search,
    ) as ConventionVersionQueries;

    let pageNum = page ? parseInt(page) : 1;

    if (this.savedItemId !== itemId) {
      this.savedItemId = itemId;

      await this.initVersions(pageNum);
    }
  };

  @action
  async initVersions(page: number = 1): Promise<void> {
    let conventionItemId = this.conventionStore.currentConventionItemId;

    if (conventionItemId) {
      let {
        pageCount,
        versions,
      } = await this.conventionService.getConventionItemVersions(
        conventionItemId,
        page,
      );

      this.versionGroups = buildVersionGroups(versions);
      this.pageCount = pageCount;
    }
  }

  onPaginationChange = (page: number): void => {
    this.routerStore.push(`?page=${page}`);
  };

  static Wrapper = Wrapper;
}

function buildVersionGroups(
  versions: ConventionItemVersion[],
): ItemVersionGroup[] {
  let result: ItemVersionGroup[] = [];

  let lastDate: string = '';

  let nowGroupIndex: number = -1;

  for (let version of versions) {
    let date = new Date(version.createdAt);

    let dateStr = date.toLocaleDateString();

    if (lastDate === dateStr) {
      result[nowGroupIndex].children.push(version);
    } else if (dateStr) {
      nowGroupIndex++;

      let group: ItemVersionGroup = {
        date: dateStr,
        children: [version],
      };

      result[nowGroupIndex] = group;
      lastDate = dateStr;
    }
  }

  return result;
}
