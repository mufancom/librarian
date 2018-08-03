import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';

import {User} from './user.entity';

export type UserServiceFindByIdentifierSearchFieldName =
  | 'id'
  | 'username'
  | 'email'
  | 'usernameAndEmail';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async findByIdentifier(
    identifier: string | number,
    searchIn: UserServiceFindByIdentifierSearchFieldName = 'usernameAndEmail',
  ): Promise<User | undefined> {
    let sql: string;

    switch (searchIn) {
      case 'usernameAndEmail':
        sql = 'username = :identifier or email = :identifier';
        break;
      default:
        sql = `${searchIn} = :identifier`;
        break;
    }

    return this.userRepository
      .createQueryBuilder()
      .where(sql, {identifier})
      .getOne();
  }

  async saveUser(user: User): Promise<void> {
    await this.userRepository.save(user);
  }
}
