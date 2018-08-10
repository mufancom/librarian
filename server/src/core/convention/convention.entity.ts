import {Column, Entity, PrimaryGeneratedColumn} from 'typeorm';

@Entity()
export class Convention {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({name: 'category_id'})
  categoryId!: number;

  @Column({name: 'order_id'})
  orderId!: number;

  @Column()
  title!: string;

  @Column()
  alias?: string;

  @Column()
  status!: number;
}
