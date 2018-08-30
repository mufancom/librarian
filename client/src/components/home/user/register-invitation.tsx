import classNames from 'classnames';
import {action, observable} from 'mobx';
import * as QueryString from 'query-string';
import React, {Component} from 'react';

import {fetchErrorMessage} from 'services/api-service';
import {UserService} from 'services/user-service';
import {RouterStore} from 'stores/router-store';
import {styled} from 'theme';
import {inject, observer} from 'utils/mobx';

import {
  RegisterInvitationFailed,
  RegisterInvitationForm,
  RegisterInvitationPending,
} from './@register-invitation-segments';

enum InvitationState {
  pending,
  granted,
  accepted,
  declined,
  expired,
}

export interface RegisterInvitationQueries {
  code?: string;
}

const Wrapper = styled.div`
  background-color: #f9f9f9;
  width: 100%;
  height: 100vh;
`;

export interface RegisterInvitationProps {
  className?: string;
}

@observer
export class RegisterInvitation extends Component<RegisterInvitationProps> {
  @inject
  routerStore!: RouterStore;

  @inject
  userService!: UserService;

  @observable
  invitationState: InvitationState = InvitationState.granted;

  @observable
  errorMessage: string = '';

  async componentWillMount(): Promise<void> {
    // await this.getInvitationGranted();
  }

  render(): JSX.Element {
    let {className} = this.props;

    return (
      <Wrapper className={classNames('register-invitation', className)}>
        {this.invitationState === InvitationState.pending ? (
          <RegisterInvitationPending />
        ) : (
          undefined
        )}

        {this.invitationState === InvitationState.granted ? (
          <RegisterInvitationForm />
        ) : (
          undefined
        )}

        {this.invitationState === InvitationState.expired ? (
          <RegisterInvitationFailed errorMessage={this.errorMessage} />
        ) : (
          undefined
        )}
      </Wrapper>
    );
  }

  @action
  getInvitationGranted = async (): Promise<void> => {
    let {code} = QueryString.parse(
      this.routerStore.location.search,
    ) as RegisterInvitationQueries;

    try {
      if (!code) {
        throw new Error('没有权限访问');
      }

      await this.userService.grantRegisterWithInvitation(code);

      this.invitationState = InvitationState.granted;
    } catch (error) {
      let errorMessage = fetchErrorMessage(error);

      this.invitationState = InvitationState.expired;
      this.errorMessage = errorMessage;
    }
  };

  static Wrapper = Wrapper;
}
