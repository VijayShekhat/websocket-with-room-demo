import { Controller, Post, Body, UseGuards, Get, Req, Request, NotFoundException, Param, ParseIntPipe } from '@nestjs/common';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { CreateOrderDto } from 'src/dtos/create-order.dto';
import { Order } from 'src/entities/order.entity';
import { OrderService } from 'src/services/order.service';


@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  // Example of a protected route
  @UseGuards(JwtAuthGuard)
  @Post('create')
  async createOrder(@Body() createOrderDto: CreateOrderDto) {
    const order = await this.orderService.createOrder(createOrderDto);
    if (!order) {
      throw new Error('Invalid Inputs');
    }
    return (order);
  }

  @UseGuards(JwtAuthGuard)
  @Get('')
  async getOrdersByUser(@Request() req){
    const order = await this.orderService.getOrdersByUser(req.user)
    if (!order) {
        throw new NotFoundException('No Order found');
      }
      return (order);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/:id')
  async getOrderById(@Param('id', ParseIntPipe) id: number): Promise<Order>{
    const order = await this.orderService.getOrderById(id)
    if (!order) {
        throw new NotFoundException('No Order found');
      }
      return (order);
  }
}
