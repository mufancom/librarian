import {computed, observable} from 'mobx';

export class AuthStore {
  @observable
  id = 0;

  @observable
  avatar = '';

  @observable
  username = '';

  @observable
  role = 0;

  @observable
  email = '';

  @observable
  registerInvitationEnabled = false;

  @computed
  get isLoggedIn(): boolean {
    return this.id !== 0;
  }
}
