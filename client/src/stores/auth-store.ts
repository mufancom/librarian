import {action, computed, observable} from 'mobx';

export class AuthStore {
  @observable
  id: number;

  @observable
  avatar: string;

  @observable
  username: string;

  constructor() {
    this.id = 0;
    this.avatar = '';
    this.username = '';
  }

  @computed
  get isLoggedIn(): boolean {
    return this.id !== 0;
  }

  @action
  login(username: string, password: string) {
    // TODO
    return username + password;
  }
}
