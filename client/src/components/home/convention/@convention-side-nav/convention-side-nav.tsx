import {message} from 'antd';
import classNames from 'classnames';
import {action, observable} from 'mobx';
import * as React from 'react';
import {RouteComponentProps, withRouter} from 'react-router';

import {fetchErrorMessage} from 'services/api-service';
import {ConventionService} from 'services/convention-service';
import {AuthStore} from 'stores/auth-store';
import {
  ConventionIndexCategoryNode,
  ConventionIndexNode,
  ConventionStore,
} from 'stores/convention-store';
import {styled} from 'theme';
import {inject, observer} from 'utils/mobx';
import {InputModal} from '../../../common/modal';
import {ConventionSideNavCategoryWithRouter} from './@convention-side-nav-category';
import {ConventionSideNavAddCategoryButton} from './@convention-side-nav-tool-btns';

const Wrapper = styled.div`
  margin-bottom: 40px;

  ul {
    margin: 0;
    padding: 0;
  }

  li {
    list-style-type: none;
    display: block;
    text-indent: 0;
  }

  ul.menu {
    margin-top: 20px;
    padding-left: 30px;
  }

  ${ConventionSideNavAddCategoryButton.Wrapper} {
    margin-top: 35px;
    margin-left: 30px;
  }
`;

interface MenuProps {
  list: ConventionIndexNode[];
  className?: string;
}

const Menu: React.SFC<MenuProps> = props => {
  const list = props.list;
  if (list) {
    return (
      <ul className="menu">
        {list.map(val => (
          <ConventionSideNavCategoryWithRouter
            key={val.entry.id}
            node={val as ConventionIndexCategoryNode}
          />
        ))}
      </ul>
    );
  } else {
    return <ul />;
  }
};

export interface ConventionSideNavProps extends RouteComponentProps<any> {
  className?: string;
}

@observer
export class ConventionSideNav extends React.Component<ConventionSideNavProps> {
  @inject
  authStore!: AuthStore;

  @inject
  conventionStore!: ConventionStore;

  @inject
  conventionService!: ConventionService;

  @observable
  inputModalVisible = false;

  @observable
  inputModalLoading = false;

  render() {
    let {className} = this.props;

    return (
      <Wrapper className={classNames('convention-side-nav', className)}>
        <InputModal
          title="添加分组"
          placeholder="请输入分组名"
          visible={this.inputModalVisible}
          onOkButtonClick={this.onInputModalOkButtonClick}
          onCancelButtonClick={this.onInputModelCancelButtonClick}
          loading={this.inputModalLoading}
        />
        <Menu list={this.conventionStore.index} />
        <ConventionSideNavAddCategoryButton
          show={this.authStore.isLoggedIn}
          onClick={this.onAddCategoryButtonOnclick}
        />
      </Wrapper>
    );
  }

  @action
  onAddCategoryButtonOnclick = () => {
    this.inputModalVisible = true;
  };

  onInputModalOkButtonClick = async (value: string) => {
    this.inputModalLoading = true;

    try {
      await this.conventionService.createCategory(0, value);

      this.inputModalVisible = false;
    } catch (error) {
      let errorMessage = fetchErrorMessage(error);

      message.error(errorMessage);
    }

    this.inputModalLoading = false;
  };

  onInputModelCancelButtonClick = () => {
    this.inputModalVisible = false;
  };
}

export const ConventionSideNavWithRouter = withRouter(ConventionSideNav);
