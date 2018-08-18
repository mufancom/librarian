import {message} from 'antd';
import classNames from 'classnames';
import {action, observable} from 'mobx';
import React, {Component} from 'react';
import {NavLink, RouteComponentProps, withRouter} from 'react-router-dom';

import {fetchErrorMessage} from 'services/api-service';
import {ConventionService} from 'services/convention-service';
import {AuthStore} from 'stores/auth-store';
import {ConventionIndexConventionNode} from 'stores/convention-store';
import {styled} from 'theme';
import {inject, observer} from 'utils/mobx';

import {
  ConventionSideNavDeleteBtn as _ConventionSideNavDeleteBtn,
  ConventionSideNavEditBtn as _ConventionSideNavEditBtn,
} from './@convention-side-nav-tool-btns';
import {ConventionSideNavShiftBtn} from './@convention-side-nav-tool-btns/convention-side-nav-shift-btn';

const Wrapper = styled.li`
  color: ${props => props.theme.text.navRegular};
  position: relative;
  font-size: 14px;
  font-weight: 400;
  padding-top: 8px;
  padding-bottom: 8px;
  list-style-type: none;
  display: block;

  a {
    color: ${props => props.theme.text.navRegular};
    text-decoration: none;
    display: block;

    &:hover {
      color: ${props => props.theme.accent()};
    }

    &.active {
      color: ${props => props.theme.accent()};
    }
  }
`;

const PositionShiftButton = styled(ConventionSideNavShiftBtn)`
  position: absolute;
  right: 20px;
  top: 5px;
`;

const ConventionSideNavEditBtn = styled(_ConventionSideNavEditBtn)`
  display: inline !important;
  margin-left: 5px;
`;

const ConventionSideNavDeleteBtn = styled(_ConventionSideNavDeleteBtn)`
  display: inline !important;
  margin-left: 5px;
`;

const ItemTitle = styled.div`
  display: inline;
  cursor: text;
`;

export interface ConventionSideNavItemProps extends RouteComponentProps<any> {
  className?: string;
  node: ConventionIndexConventionNode;
}

@observer
export class ConventionSideNavItem extends Component<
  ConventionSideNavItemProps
> {
  @inject
  authStore!: AuthStore;

  @inject
  conventionService!: ConventionService;

  @observable
  showShiftButton = false;

  render() {
    let {
      className,
      node: {entry},
    } = this.props;

    return (
      <Wrapper
        className={classNames('convention-side-nav-item', className)}
        onMouseEnter={this.onMouseEnter}
        onMouseLeave={this.onMouseLeave}
      >
        <NavLink to={`/convention/${entry.id}`}>
          <ItemTitle contentEditable={true}>{entry.title}</ItemTitle>
          <ConventionSideNavEditBtn
            show={this.showShiftButton && this.authStore.isLoggedIn}
          />
          <ConventionSideNavDeleteBtn
            show={this.showShiftButton && this.authStore.isLoggedIn}
            onClick={this.onDeleteButtonClick}
          />
        </NavLink>
        <PositionShiftButton
          show={this.showShiftButton && this.authStore.isLoggedIn}
          upOnclick={this.onUpShiftButtonOnclick}
          downOnclick={this.onDownShiftButtonOnclick}
        />
      </Wrapper>
    );
  }

  @action
  onMouseEnter = () => {
    this.showShiftButton = true;
  };

  @action
  onMouseLeave = () => {
    this.showShiftButton = false;
  };

  onDeleteButtonClick = async () => {
    let {
      node: {entry},
    } = this.props;

    try {
      await this.conventionService.deleteConvention(entry.id);
    } catch (error) {
      let errorMessage = fetchErrorMessage(error);

      message.error(errorMessage);
    }
  };

  onUpShiftButtonOnclick = async () => {
    await this.shiftConvention(-2);
  };

  onDownShiftButtonOnclick = async () => {
    await this.shiftConvention(1);
  };

  async shiftConvention(offset: number) {
    let {
      node: {
        entry: {id, orderId},
      },
    } = this.props;

    try {
      await this.conventionService.shiftConvention(id, orderId + offset);
    } catch (error) {
      let errorMessage = fetchErrorMessage(error);

      message.error(errorMessage);
    }
  }

  static Wrapper = Wrapper;
}

export const ConventionSideNavItemWithRouter = withRouter(
  ConventionSideNavItem,
);
