import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum RegisterInvitationStatus {
  pending,
  granted,
  accepted,
  declined,
}

@Entity('user_register_invitation')
export class RegisterInvitation {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({name: 'from_user_id'})
  fromUserId!: number;

  @Column()
  email!: string;

  @Column({name: 'link_hash'})
  linkHash!: string;

  @CreateDateColumn({name: 'created_at', type: 'timestamp'})
  createdAt!: Date;

  @Column({name: 'expired_at', type: 'timestamp'})
  expiredAt!: Date;

  @Column()
  status!: RegisterInvitationStatus;
}
