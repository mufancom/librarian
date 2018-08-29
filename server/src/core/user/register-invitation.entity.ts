import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class RegisterInvitation {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column('link_hash')
  linkHash!: string;

  @CreateDateColumn({name: 'created_at', type: 'timestamp'})
  createdAt!: Date;

  @Column({name: 'expired_at', type: 'timestamp'})
  expiredAt!: Date;
}
