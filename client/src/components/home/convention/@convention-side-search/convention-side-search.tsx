import Search from 'antd/lib/input/Search';
import classNames from 'classnames';
import React, {Component} from 'react';

import {styled} from 'theme';
import {observer} from 'utils/mobx';

const Wrapper = styled.div``;

export interface ConventionSideSearchProps {
  className?: string;
}

@observer
export class ConventionSideSearch extends Component<ConventionSideSearchProps> {
  render() {
    let {className} = this.props;

    return (
      <Wrapper className={classNames('convention-side-search', className)}>
        <Search placeholder="搜索规范..." style={{width: 180}} />
      </Wrapper>
    );
  }

  static Wrapper = Wrapper;
}
