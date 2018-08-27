import {Avatar, Button, Card, Pagination, Timeline} from 'antd';
import classNames from 'classnames';
import React, {Component} from 'react';

import {ConventionService} from 'services/convention-service';
import {UserService} from 'services/user-service';
import {ConventionStore, ITEM_VERSION_PAGE_SIZE} from 'stores/convention-store';
import {RouterStore} from 'stores/router-store';
import {styled} from 'theme';
import {formatAsTimeAgo} from 'utils/date';
import {inject, observer} from 'utils/mobx';

import {ConventionVersionsHeader} from './@convention-versions-header';

const ButtonGroup = Button.Group;

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
              {group.children.map(itemVersionWithUserInfo => {
                let {itemVersion, user} = itemVersionWithUserInfo;

                let {id, message, hash, createdAt, fromId} = itemVersion;

                let {username, email} = user;

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
                        <Avatar
                          size={17}
                          icon="user"
                          src={this.userService.getAvatarUrl(email)}
                        />{' '}
                        {username} 提交于 {formatAsTimeAgo(createdAt)}
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
