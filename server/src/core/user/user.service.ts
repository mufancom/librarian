import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {DeepPartial, Repository} from 'typeorm';

import {User} from './user.entity';

export type UserServiceFindByIdentifierSearchFieldName =
  | 'id'
  | 'username'
  | 'email'
  | 'usernameAndEmail';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
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

  async save(user: User): Promise<User> {
    return this.userRepository.save(user);
  }

  async create(userLike: DeepPartial<User>): Promise<User> {
    let user = this.userRepository.create(userLike);
    return this.userRepository.save(user);
  }
}
