// src/order/dto/create-order.dto.ts

import { IsInt, IsOptional, IsNotEmpty, Min, IsPositive } from 'class-validator';

export class CreateOrderDto {
  @IsInt()
  @IsNotEmpty()
  @Min(1)  // Ensure the ID is a positive integer
  buyerId: number;

  @IsInt()
  @IsNotEmpty()
  @Min(1)  // Ensure the ID is a positive integer
  sellerId: number;

  @IsInt()
  @IsOptional()  // Delivery boy is optional
  @Min(1)  // Ensure the ID is a positive integer
  deliveryBoyId?: number;
}
