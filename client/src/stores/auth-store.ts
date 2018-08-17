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

  @observable
  email: string;

  constructor() {
    this.id = 0;
    this.role = 0;
    this.avatar = '';
    this.username = '';
    this.email = '';
  }

  @computed
  get isLoggedIn(): boolean {
    return this.id !== 0;
  }
}
