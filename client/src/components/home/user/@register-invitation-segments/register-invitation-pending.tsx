import {Icon} from 'antd';
import classNames from 'classnames';
import React, {Component} from 'react';

import {styled} from 'theme';
import {observer} from 'utils/mobx';

const Wrapper = styled.div`
  width: 100px;
  margin: auto;
  padding-top: 39vh;
`;

const LoadingSpinner = styled.div`
  font-size: 35px;
  color: ${props => props.theme.accent()};
`;

const HintText = styled.div`
  margin-top: 10px;
  color: ${props => props.theme.text.secondary};
`;

export interface RegisterInvitationPendingProps {
  className?: string;
}

@observer
export class RegisterInvitationPending extends Component<
  RegisterInvitationPendingProps
> {
  render(): JSX.Element {
    let {className} = this.props;

    return (
      <Wrapper className={classNames('register-invitation-pending', className)}>
        <LoadingSpinner>
          <Icon type="loading" spin />
        </LoadingSpinner>
        <HintText>加载中</HintText>
      </Wrapper>
    );
  }

  static Wrapper = Wrapper;
}
