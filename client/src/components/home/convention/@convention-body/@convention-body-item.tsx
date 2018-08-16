import classNames from 'classnames';
import React, {Component} from 'react';

import {action, observable} from 'mobx';
import {AuthStore} from 'stores/auth-store';
import {ConventionItem} from 'stores/convention-store';
import {styled} from 'theme';
import {formatAsTimeAge} from 'utils/date';
import {mark} from 'utils/markdown';
import {inject, observer} from 'utils/mobx';
import {ConventionBodyItemEdit} from './@convention-body-item-edit';
import {ConventionBodyItemFooter} from './@convention-body-item-footer';

const Wrapper = styled.div`
  padding-bottom: 1.9rem;
  position: relative;

  ${ConventionBodyItemEdit.Wrapper} {
    position: absolute;
    z-index: 500;
    left: 0;
    right: 0;
    top: 46px;
    bottom: 0;
  }

  ${ConventionBodyItemFooter.Wrapper} {
    margin-bottom: 5px;
  }
`;

const ItemTopToolBar = styled.div`
  margin-top: 3px;
  position: absolute;
  right: 10px;
  text-align: right;
  transition: all 0.3s;
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

  @observable
  showSidebar = false;

  @observable
  editMode = false;

  render() {
    let {className, item} = this.props;

    return (
      <Wrapper
        className={classNames('convention-body-item', className)}
        onMouseEnter={this.conventionOnHoverStart}
        onMouseLeave={this.conventionOnHoverEnd}
      >
        {this.editMode ? (
          <ConventionBodyItemEdit item={item} />
        ) : (
          <ItemTopToolBar style={{opacity: this.showSidebar ? 1 : 0}}>
            <ItemVersionInfo>
              版本ID:&nbsp;
              {item.versionId} ({formatAsTimeAge(item.updatedAt)})
            </ItemVersionInfo>
            {this.authStore.isLoggedIn ? (
              <a onClick={this.editOnclick}>编辑</a>
            ) : (
              undefined
            )}
          </ItemTopToolBar>
        )}
        <ItemRenderContent
          dangerouslySetInnerHTML={{__html: mark(item.content)}}
        />
        <ConventionBodyItemFooter item={item} />
      </Wrapper>
    );
  }

  @action
  conventionOnHoverStart = () => {
    this.showSidebar = true;
  };

  @action
  conventionOnHoverEnd = () => {
    this.showSidebar = false;
  };

  @action
  editOnclick = () => {
    this.editMode = true;
  };

  static Wrapper = Wrapper;
}
