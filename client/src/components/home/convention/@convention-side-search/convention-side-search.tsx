import {AutoComplete, Icon, Input} from 'antd';
import {SelectValue} from 'antd/lib/select';
import classNames from 'classnames';
import {action, observable} from 'mobx';
import React, {Component, createRef} from 'react';
import ReactDOM from 'react-dom';

import {ConventionService} from 'services/convention-service';
import {ConventionStore, SearchResult} from 'stores/convention-store';
import {RouterStore} from 'stores/router-store';
import {styled} from 'theme';
import {inject, observer} from 'utils/mobx';

import {SearchConventionItem} from './@search-convention-item';

const Option = AutoComplete.Option;
const OptGroup = AutoComplete.OptGroup;

const Wrapper = styled.div`
  position: relative;

  .ant-input {
    height: 34px !important;
  }

  .search-result-dropdown {
    width: 203px;
    left: -3px !important;
    top: 50px !important;

    .ant-select-dropdown-menu {
      max-height: 500px;
    }
  }
`;

export interface ConventionSideSearchProps {
  className?: string;
}

function renderConventionResult(data: SearchResult): JSX.Element | undefined {
  let {conventions} = data;

  if (conventions && conventions.length) {
    return (
      <OptGroup key="convention" label="规范">
        {conventions.map(convention => (
          <Option key={convention.id} value={`convention:${convention.id}`}>
            {convention.title}
          </Option>
        ))}
      </OptGroup>
    );
  }

  return undefined;
}

function renderConventionItemResult(
  data: SearchResult,
): JSX.Element | undefined {
  let {items, segments} = data;

  if (items && items.length) {
    return (
      <OptGroup key="item" label="条目">
        {items.map(item => (
          <Option
            key={item.id}
            value={`convention:${item.conventionId}, item:${item.id}`}
          >
            <SearchConventionItem segments={segments} item={item} />
          </Option>
        ))}
      </OptGroup>
    );
  }

  return undefined;
}

function renderResult(data: SearchResult | undefined): JSX.Element[] {
  let result: JSX.Element[] = [];

  if (data) {
    let conventionOutput = renderConventionResult(data);

    if (conventionOutput) {
      result = result.concat(conventionOutput);
    }

    let itemOutput = renderConventionItemResult(data);

    if (itemOutput) {
      result = result.concat(itemOutput);
    }
  }

  return result;
}

@observer
export class ConventionSideSearch extends Component<ConventionSideSearchProps> {
  @inject
  routerStore!: RouterStore;

  @inject
  conventionStore!: ConventionStore;

  @inject
  conventionService!: ConventionService;

  @observable
  searchKeywords: string = '';

  @observable
  searchValue: string = '';

  searchTimer: any;

  wrapperRef: React.RefObject<any> = createRef();

  autoCompleteRef: React.RefObject<AutoComplete> = createRef();

  componentWillUnmount(): void {
    if (this.searchTimer) {
      clearTimeout(this.searchTimer);
    }
  }

  render(): JSX.Element {
    let {className} = this.props;

    return (
      <Wrapper
        className={classNames('convention-side-search', className)}
        ref={this.wrapperRef}
      >
        <AutoComplete
          className="certain-category-search"
          dropdownClassName="certain-category-search-dropdown search-result-dropdown"
          dropdownMatchSelectWidth={false}
          size="large"
          style={{width: '96%', fontSize: '13px'}}
          dataSource={renderResult(this.conventionStore.searchResult)}
          placeholder="搜索规范..."
          optionLabelProp="value"
          onChange={this.onInputChange}
          getPopupContainer={this.getWrapperDom}
          onSelect={this.onItemSelect}
          filterOption={false}
          value={this.searchValue}
          ref={this.autoCompleteRef}
        >
          <Input
            style={{fontSize: '13px'}}
            suffix={<Icon type="search" className="certain-category-icon" />}
          />
        </AutoComplete>
      </Wrapper>
    );
  }

  getWrapperDom = (): HTMLLIElement => {
    return ReactDOM.findDOMNode(this.wrapperRef.current) as HTMLLIElement;
  };

  @action
  onInputChange = (selectValue: SelectValue): void => {
    let value = selectValue.toString();

    if (value.startsWith('convention:') || value.startsWith('item:')) {
      this.searchValue = '';

      this.autoCompleteRef.current!.blur();

      return;
    }

    this.searchValue = value;

    this.searchKeywords = value;

    if (this.searchTimer) {
      clearTimeout(this.searchTimer);
    }

    this.searchTimer = setTimeout(this.search, 300);
  };

  search = async (): Promise<void> => {
    await this.conventionService.search(this.searchKeywords);

    this.searchTimer = undefined;
  };

  @action
  onItemSelect = async (selectValue: SelectValue): Promise<void> => {
    let value = selectValue.toString();

    let result = value.match(/convention:(\d+)(?:, item:(\d+))?/);

    if (result) {
      let conventionId = parseInt(result[1]);

      let itemId = result[2] ? parseInt(result[2]) : undefined;

      // tslint:disable-next-line:no-console
      console.log(conventionId, itemId);

      let convention = await this.conventionService.getConvention(conventionId);

      let path = await this.conventionService.getPathByConvention(convention);

      let fullPath = `/convention/${path}/${
        itemId ? `#convention-item-${itemId}` : ''
      }`;

      this.routerStore.push(fullPath);
    }
  };

  static Wrapper = Wrapper;
}
