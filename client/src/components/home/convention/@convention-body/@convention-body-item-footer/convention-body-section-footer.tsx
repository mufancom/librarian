import classNames from 'classnames';
import React, {Component} from 'react';

import {ConventionItem} from 'stores/convention-store';
import {styled} from 'theme';
import {observer} from 'utils/mobx';

const Wrapper = styled.div``;

export interface ConventionBodyItemFooterProps {
  className?: string;
  item: ConventionItem;
}

@observer
export class ConventionBodyItemFooter extends Component<
  ConventionBodyItemFooterProps
> {
  render() {
    let {className} = this.props;

    return (
      <Wrapper className={classNames('convention-body-item-footer', className)}>
        &nbsp;
      </Wrapper>
    );
  }

  static Wrapper = Wrapper;
}
