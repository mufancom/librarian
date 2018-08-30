import classNames from 'classnames';
import React, {Component} from 'react';

import logoImg from 'assets/images/librarian.svg';
import {styled} from 'theme';
import {observer} from 'utils/mobx';

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
`;

const LoginIconWrapper = styled.div`
  img {
    height: 43px;
    width: 43px;
  }
`;

export interface RegisterInvitationLogoProps {
  className?: string;
}

@observer
export class RegisterInvitationLogo extends Component<
  RegisterInvitationLogoProps
> {
  render(): JSX.Element {
    let {className} = this.props;

    return (
      <Wrapper className={classNames('register-invitation-logo', className)}>
        <LoginIconWrapper>
          <img src={logoImg} />
        </LoginIconWrapper>
      </Wrapper>
    );
  }

  static Wrapper = Wrapper;
}
