import {computed, observable} from 'mobx';

export class AuthStore {
  @observable
  id: number;

  @observable
  avatar: string;

  @observable
  username: string;

  @observable
  role: number;

  constructor() {
    this.id = 0;
    this.role = 0;
    this.avatar = '';
    this.username = '';
  }

  @computed
  get isLoggedIn(): boolean {
    return this.id !== 0;
  }
}
