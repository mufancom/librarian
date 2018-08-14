import classNames from 'classnames';
import React, {Component} from 'react';

import {ConventionItem} from 'stores/convention-store';
import {styled} from 'theme';
import {mark} from 'utils/markdown';
import {observer} from 'utils/mobx';
import {ConventionBodyItemFooter} from './@convention-body-item-footer';

const Wrapper = styled.div`
  padding-bottom: 1.9rem;

  ${ConventionBodyItemFooter.Wrapper} {
    margin-bottom: 5px;
  }
`;

export interface ConventionBodyItemProps {
  className?: string;
  item: ConventionItem;
}

@observer
export class ConventionBodyItem extends Component<ConventionBodyItemProps> {
  render() {
    let {className, item} = this.props;

    return (
      <Wrapper className={classNames('convention-body-item', className)}>
        <div dangerouslySetInnerHTML={{__html: mark(item.content)}} />
        <ConventionBodyItemFooter item={item} />
      </Wrapper>
    );
  }

  static Wrapper = Wrapper;
}
