import {Injectable} from '@nestjs/common';

import {UserService} from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  async findUserById(id: number) {
    return this.userService.findByIdentifier(id, 'id');
  }

  async findUserByUsernameOrEmail(usernameOrEmail: string) {
    return this.userService.findByIdentifier(
      usernameOrEmail,
      'usernameAndEmail',
    );
  }
}
