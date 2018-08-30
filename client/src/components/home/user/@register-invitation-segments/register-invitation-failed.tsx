import classNames from 'classnames';
import React, {Component} from 'react';

import {styled} from 'theme';
import {observer} from 'utils/mobx';

const Wrapper = styled.div``;

export interface RegisterInvitationFailedProps {
  className?: string;
  errorMessage: string;
}

@observer
export class RegisterInvitationFailed extends Component<
  RegisterInvitationFailedProps
> {
  render(): JSX.Element {
    let {className, errorMessage} = this.props;

    return (
      <Wrapper className={classNames('register-invitation-failed', className)}>
        {errorMessage}
      </Wrapper>
    );
  }

  static Wrapper = Wrapper;
}
