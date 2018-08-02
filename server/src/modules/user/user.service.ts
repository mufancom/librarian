import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';

import {randomStr} from 'utils/string';
import {User} from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async findByIdentifier(
    identifier: string,
    searchIn: 'username' | 'email' | 'both' = 'both',
  ): Promise<User | undefined> {
    let sql: string;

    switch (searchIn) {
      case 'both':
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

  async generateToken(user: User): Promise<string> {
    user.token = randomStr(24);
    await this.userRepository.save(user);
    return user.token;
  }

  async registerUser(user: User): Promise<void> {
    await this.userRepository.save(user);
  }
}
