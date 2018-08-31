import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {DeepPartial, Repository} from 'typeorm';

import {
  ResourceConflictingException,
  ResourceNotFoundException,
} from 'common/exceptions';
import {md5} from 'utils/encryption';
import {isOutDated} from 'utils/repository';

import {
  RegisterInvitation,
  RegisterInvitationStatus,
} from './register-invitation.entity';
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
    @InjectRepository(RegisterInvitation)
    private registerInvitationRepository: Repository<RegisterInvitation>,
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

  async getAllUsers(): Promise<User[]> {
    return this.userRepository.createQueryBuilder().getMany();
  }

  async save(user: User): Promise<User> {
    return this.userRepository.save(user);
  }

  async create(userLike: DeepPartial<User>): Promise<User> {
    let user = this.userRepository.create(userLike);
    return this.userRepository.save(user);
  }

  async findRegisterInvitationById(
    id: number,
  ): Promise<RegisterInvitation | undefined> {
    return this.registerInvitationRepository
      .createQueryBuilder()
      .where('id = :id', {id})
      .getOne();
  }

  async findRegisterInvitationByHash(
    hash: string,
  ): Promise<RegisterInvitation | undefined> {
    return this.registerInvitationRepository
      .createQueryBuilder()
      .where(
        'link_hash = :hash and status != :accepted and status != :declined',
        {
          hash,
          accepted: RegisterInvitationStatus.accepted,
          declined: RegisterInvitationStatus.declined,
        },
      )
      .getOne();
  }

  async createRegisterInvitation(
    fromUserId: number,
    email: string,
    lifespan: number,
  ): Promise<RegisterInvitation> {
    let now = Date.now();

    let expiredAt = new Date(now + 1000 * lifespan);

    let invitationLike = {
      fromUserId,
      email,
      expiredAt,
      status: RegisterInvitationStatus.pending,
    };

    let invitation = this.registerInvitationRepository.create(invitationLike);

    let linkHash = await md5(invitation);

    linkHash += await md5(linkHash + now);

    invitation.linkHash = linkHash;

    return this.registerInvitationRepository.save(invitation);
  }

  async validateRegisterInvitation(
    invitation: RegisterInvitation | undefined,
    status: RegisterInvitationStatus,
  ): Promise<void> {
    if (
      !invitation ||
      isOutDated(invitation.expiredAt) ||
      invitation.status !== status
    ) {
      throw new ResourceNotFoundException('REGISTER_INVITATION_NOT_FOUND');
    }

    if (await this.findByIdentifier(invitation.email, 'email')) {
      throw new ResourceConflictingException('EMAIL_ALREADY_EXISTS');
    }
  }

  async saveRegisterInvitation(
    invitation: RegisterInvitation,
  ): Promise<RegisterInvitation> {
    return this.registerInvitationRepository.save(invitation);
  }
}
