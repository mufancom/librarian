import classNames from 'classnames';
import React, {Component} from 'react';

import {styled} from 'theme';
import {observer} from 'utils/mobx';

const Wrapper = styled.div`
  margin-top: 22px;
`;

export interface ConventionIndexProps {
  className?: string;
}

@observer
export class ConventionIndex extends Component<ConventionIndexProps> {
  render(): JSX.Element {
    let {className} = this.props;

    return (
      <Wrapper className={classNames('convention-index', className)}>
        <h1>TODOs</h1>
        <p>- Comment</p>
        <p>- Thumbs up</p>
        <p>- Version review and rollback</p>
        <p>- Search in conventions</p>
        <p>- User change password</p>
        <p>- A new markdown editor</p>
        <p>- Q&A</p>
      </Wrapper>
    );
  }

  static Wrapper = Wrapper;
}
