import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';  // Assuming User entity exists and contains buyer, seller, delivery boy

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  // Many-to-One relationship: an order can have one buyer
  @ManyToOne(() => User)
  @JoinColumn({ name: 'buyerId' })
  buyer: User;

  // Many-to-One relationship: an order can have one seller
  @ManyToOne(() => User)
  @JoinColumn({ name: 'sellerId' })
  seller: User;

  // Many-to-One relationship: an order can have one delivery boy
  @ManyToOne(() => User)
  @JoinColumn({ name: 'deliveryBoyId' })
  deliveryBoy: User;
}
