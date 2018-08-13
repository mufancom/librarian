import {Column, Entity, PrimaryGeneratedColumn} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({length: 20})
  username!: string;

  @Column({length: 48})
  password!: string;

  @Column({length: 50})
  email!: string;
}
