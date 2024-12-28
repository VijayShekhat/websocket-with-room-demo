import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateOrderDto } from 'src/dtos/create-order.dto';
import { Order } from 'src/entities/order.entity';
import { OrderRepository } from 'src/repositories/order.repository';
import { UserRepository } from 'src/repositories/user.repository';

@Injectable()
export class OrderService {
  constructor(
    private orderRepository: OrderRepository,
    private userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  async createOrder(createOrderDto: CreateOrderDto): Promise<any> {
    var buyer = await this.userRepository.findById(createOrderDto.buyerId)
    var seller = await this.userRepository.findById(createOrderDto.sellerId)
    var deliveryBoy = null
    if(createOrderDto.deliveryBoyId){
        deliveryBoy = await this.userRepository.findById(createOrderDto.deliveryBoyId)
    }
    
    return this.orderRepository.createOrder({ buyer: buyer, seller: seller, deliveryBoy: deliveryBoy });
  }

  async getOrdersByUser(user: any): Promise<Order[]> {
    return await this.orderRepository.getOrdersByUser(user.id);
  }

  async getOrderById(id: number): Promise<Order> {
    return await this.orderRepository.getOrderById(id);
  }
}
