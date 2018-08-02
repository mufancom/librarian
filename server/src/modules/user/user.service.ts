import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';

import {api} from 'utils/api-formater';
import {randomStr} from 'utils/string';
import {User} from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async findByUsernameOrEmail(username: string): Promise<User | undefined> {
    return this.userRepository
      .createQueryBuilder()
      .where('username = :username or email = :username', {username})
      .getOne();
  }

  async generateToken(user: User): Promise<string> {
    user.token = randomStr(24);
    await this.userRepository.save(user);
    return user.token;
  }
}
