import {Inject, Injectable} from '@nestjs/common';

import {UserDataService} from '../user';

@Injectable()
export class AuthService {
  constructor(
    @Inject(UserDataService) private readonly userDataService: UserDataService,
  ) {}

  async findUserById(id: number) {
    return this.userDataService.findByIdentifier(id, 'id');
  }

  async findUserByUsernameOrEmail(usernameOrEmail: string) {
    return this.userDataService.findByIdentifier(
      usernameOrEmail,
      'usernameAndEmail',
    );
  }
}
