import {Inject, Injectable} from '@nestjs/common';

import {UserService} from '../user';

@Injectable()
export class AuthService {
  constructor(
    @Inject(UserService) private readonly userDataService: UserService,
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
