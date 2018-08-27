import {Avatar, Button, Card, Tooltip} from 'antd';
import classNames from 'classnames';
import React, {Component} from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';

import {UserService} from 'services/user-service';
import {ConventionItemVersionWithUserInfo} from 'stores/convention-store';
import {styled} from 'theme';
import {formatAsTimeAgo} from 'utils/date';
import {inject, observer} from 'utils/mobx';

const ButtonGroup = Button.Group;

const Wrapper = styled.div`
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
`;

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
    margin-right: 15px;
  }

  .rollback-button {
    font-size: 12px;
    padding: 0;
  }
`;

export interface ConventionVersionItemProps {
  className?: string;
  item: ConventionItemVersionWithUserInfo;
}

@observer
export class ConventionVersionItem extends Component<
  ConventionVersionItemProps
> {
  @inject
  userService!: UserService;

  render(): JSX.Element {
    let {className, item} = this.props;

    let {itemVersion, user} = item;

    let {id, message, hash, createdAt, fromId} = itemVersion;

    let {username, email} = user;

    if (fromId) {
      message = message ? message : `#${id} 编辑`;
    } else {
      message = message ? message : `首次添加`;
    }

    return (
      <Wrapper className={classNames('convention-version-item', className)}>
        <Card>
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
              <CopyToClipboard text={hash}>
                <Tooltip placement="left" title="已复制" trigger="click">
                  <Button className="copy-button" icon="copy" />
                </Tooltip>
              </CopyToClipboard>
              <Button style={{width: '82px'}}>{hash.slice(0, 7)}</Button>
            </ButtonGroup>
            <Button className="rollback-button" style={{width: '52px'}}>
              {'回滚'}
            </Button>
          </CardRightSide>
        </Card>
      </Wrapper>
    );
  }

  static Wrapper = Wrapper;
}
