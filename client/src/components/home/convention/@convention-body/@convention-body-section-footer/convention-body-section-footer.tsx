import classNames from 'classnames';
import React, {Component} from 'react';

import {styled} from 'theme';
import {observer} from 'utils/mobx';

const Wrapper = styled.div``;

export interface ConventionBodySectionFooterProps {
  className?: string;
  uuid: string;
}

@observer
export class ConventionBodySectionFooter extends Component<
  ConventionBodySectionFooterProps
> {
  render() {
    let {className} = this.props;

    return (
      <Wrapper
        className={classNames('convention-body-section-footer', className)}
      >
        convention-body-section-footer
      </Wrapper>
    );
  }

  static Wrapper = Wrapper;
}
