import {Icon} from 'antd';
import classNames from 'classnames';
import React, {Component} from 'react';

import {styled} from 'theme';
import {observer} from 'utils/mobx';

const Wrapper = styled.div`
  padding-top: 36vh;
  width: 400px;
  margin: auto;
`;

const ErrorSign = styled.div`
  color: ${props => props.theme.accent()};
  font-size: 60px;
  animation: fadeUpIn 0.3s;
`;

const ErrorMessage = styled.div`
  margin-top: 25px;
  font-size: 16px;
  animation: fadeUpIn 0.4s;
`;

const HomeLink = styled.a`
  display: block;
  margin-top: 10px;
  animation: fadeUpIn 0.5s;
`;

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
        <ErrorSign>:(</ErrorSign>
        <ErrorMessage>
          出错啦：
          {errorMessage}
        </ErrorMessage>
        <HomeLink href="/">
          访问 Librarian <Icon type="arrow-right" />
        </HomeLink>
      </Wrapper>
    );
  }

  static Wrapper = Wrapper;
}
