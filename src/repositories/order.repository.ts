import { NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { BaseRepository } from "src/common/repo/entity.repository";
import { CreateOrderDto } from "src/dtos/create-order.dto";
import { Order } from "src/entities/order.entity";
import { Repository } from "typeorm";

export class OrderRepository extends BaseRepository<Order> {

  constructor(
    @InjectRepository(Order) private readonly entity: Repository<Order>,
  ) { super(entity); }

  async findById(id: number) {
    return await this.entity.findOne({ where: { id: id } });
  }

  async createOrder(createOrderData: any): Promise<Order> {
    const { buyer, seller, deliveryBoy } = createOrderData;
    if (!buyer) {
      throw new NotFoundException(`Buyer with ID ${buyer} not found`);
    }
    if (!seller) {
      throw new NotFoundException(`Seller with ID ${seller} not found`);
    }
    if (!deliveryBoy) {
      var order = await this.entity.create({
        buyer,
        seller,
      });
    }
    else{
      var order = await this.entity.create({
        buyer,
        seller,
        deliveryBoy,
      });
    }
    // Create the new user instance
    

    // Save the user to the database
    return await this.entity.save(order);
  }

  async getOrdersByUser(userId: number): Promise<Order[]> {
    return await this.entity.createQueryBuilder('order')
      .leftJoinAndSelect('order.buyer', 'buyer')
      .leftJoinAndSelect('order.seller', 'seller')
      .leftJoinAndSelect('order.deliveryBoy', 'deliveryBoy')
      .where('buyer.id = :userId', { userId })
      .orWhere('seller.id = :userId', { userId })
      .orWhere('deliveryBoy.id = :userId', { userId })
      .getMany();
  }

  async getOrderById(id: number): Promise<Order> {
    const order = await this.entity.findOne({
      where: { id },
      relations: ['buyer', 'seller', 'deliveryBoy'],  // Include relations if needed
    });

    return order;
  }
}