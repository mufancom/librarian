import {Popconfirm, message} from 'antd';
import classNames from 'classnames';
import {action, observable} from 'mobx';
import React, {Component} from 'react';
import {NavLink} from 'react-router-dom';

import {fetchErrorMessage} from 'services/api-service';
import {ConventionService} from 'services/convention-service';
import {AuthStore} from 'stores/auth-store';
import {ConventionItem} from 'stores/convention-store';
import {styled} from 'theme';
import {formatAsTimeAgo} from 'utils/date';
import {inject, observer} from 'utils/mobx';

import {ConventionBodyItemEdit} from './@convention-body-item-edit';
import {ConventionBodyItemEditor} from './@convention-body-item-editor';
import {ConventionBodyItemFooter} from './@convention-body-item-footer';
import {ConventionBodyItemShiftButton} from './@convention-body-item-shift-button';

const Wrapper = styled.div`
  padding-bottom: 1.9rem;
  position: relative;

  &.shift-loading {
    opacity: 0.5;
  }

  ${ConventionBodyItemEditor.Wrapper} {
    left: 0;
    right: 0;
    bottom: 0;
  }

  ${ConventionBodyItemFooter.Wrapper} {
    margin-bottom: 5px;
  }

  ${ConventionBodyItemShiftButton.Wrapper} {
    position: absolute;
    top: 5px;
    right: -24px;
  }
`;

const ItemTopToolBar = styled.div`
  position: absolute;
  right: 10px;
  text-align: right;
  transition: all 0.3s;
`;

const ItemTopToolBarButton = styled.a`
  margin-left: 7px;
  font-size: 0.85rem;

  &.danger {
    color: ${props => props.theme.dangerAccent()} !important;
  }
`;

const ItemTopToolBarNavLink = styled(NavLink)`
  margin-left: 7px;
  font-size: 0.85rem;

  &.danger {
    color: ${props => props.theme.dangerAccent()} !important;
  }
`;

const ItemVersionInfo = styled.div`
  font-size: 0.85rem;
  color: ${props => props.theme.text.secondary};
`;

const ItemRenderContent = styled.div``;

export interface ConventionBodyItemProps {
  className?: string;
  item: ConventionItem;
}

@observer
export class ConventionBodyItem extends Component<ConventionBodyItemProps> {
  @inject
  authStore!: AuthStore;

  @inject
  conventionService!: ConventionService;

  @observable
  showSidebar = false;

  @observable
  editMode = false;

  @observable
  editLoading = false;

  @observable
  shiftLoading = false;

  render(): JSX.Element {
    let {className, item} = this.props;

    return (
      <Wrapper
        className={classNames(
          'convention-body-item',
          className,
          this.shiftLoading ? 'shift-loading' : undefined,
        )}
        onMouseEnter={this.conventionOnHoverStart}
        onMouseLeave={this.conventionOnHoverEnd}
      >
        {this.editMode ? (
          <ConventionBodyItemEdit
            item={item}
            onCancelOnclick={this.onEditCancelClick}
            onOkClick={this.onEditOkClick}
            loading={this.editLoading}
          />
        ) : (
          <div>
            <ItemTopToolBar
              style={{
                opacity: this.showSidebar ? 1 : 0,
                right: this.authStore.isLoggedIn ? '28px' : '10px',
              }}
            >
              <ItemVersionInfo>
                版本:&nbsp;
                {item.versionHash.slice(0, 7)} (
                {formatAsTimeAgo(item.versionCreatedAt)})
              </ItemVersionInfo>
              <div>
                <ItemTopToolBarNavLink to={`${item.id}/versions`}>
                  历史版本
                </ItemTopToolBarNavLink>
                {this.authStore.isLoggedIn ? (
                  <div style={{display: 'inline'}}>
                    <ItemTopToolBarButton onClick={this.editOnclick}>
                      编辑
                    </ItemTopToolBarButton>
                    <Popconfirm
                      placement="bottomRight"
                      title="您确定要删除该条目？"
                      onConfirm={this.deleteOnclick}
                      okText="确定"
                      cancelText="取消"
                    >
                      <ItemTopToolBarButton className="danger">
                        删除
                      </ItemTopToolBarButton>
                    </Popconfirm>
                    <ConventionBodyItemShiftButton
                      upOnclick={this.onUpShiftButtonClick}
                      downOnclick={this.onDownShiftButtonClick}
                    />
                  </div>
                ) : (
                  undefined
                )}
              </div>
            </ItemTopToolBar>

            <ItemRenderContent
              id={`convention-item-${item.id}`}
              dangerouslySetInnerHTML={{__html: item.renderedHTML}}
            />
            <ConventionBodyItemFooter item={item} />
          </div>
        )}
      </Wrapper>
    );
  }

  @action
  conventionOnHoverStart = (): void => {
    this.showSidebar = true;
  };

  @action
  conventionOnHoverEnd = (): void => {
    this.showSidebar = false;
  };

  @action
  editOnclick = (): void => {
    this.editMode = true;
  };

  @action
  deleteOnclick = async (): Promise<void> => {
    let {item} = this.props;

    try {
      await this.conventionService.deleteConventionItem(item);

      message.success('条目删除成功！');
    } catch (error) {
      let errorMessage = fetchErrorMessage(error);

      message.error(errorMessage);
    }
  };

  @action
  onEditCancelClick = (): void => {
    this.editMode = false;
  };

  @action
  onEditOkClick = async (content: string, versionId: number): Promise<void> => {
    let {item} = this.props;

    this.editLoading = true;

    try {
      await this.conventionService.editConventionItem(item, versionId, content);

      message.success('条目编辑成功！');

      this.editMode = false;
    } catch (error) {
      let errorMessage = fetchErrorMessage(error);

      message.error(errorMessage);
    }

    this.editLoading = false;
  };

  onUpShiftButtonClick = async (): Promise<void> => {
    await this.shiftCategory(-2);
  };

  onDownShiftButtonClick = async (): Promise<void> => {
    await this.shiftCategory(1);
  };

  @action
  async shiftCategory(offset: number): Promise<void> {
    this.shiftLoading = true;

    let {item} = this.props;

    let {orderId} = item;

    try {
      await this.conventionService.shiftConventionItem(item, orderId + offset);
    } catch (error) {
      let errorMessage = fetchErrorMessage(error);

      message.error(errorMessage);
    }

    this.shiftLoading = false;
  }

  static Wrapper = Wrapper;
}
