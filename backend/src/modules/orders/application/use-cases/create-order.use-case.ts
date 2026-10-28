import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from '../dtos/create-order.dto';
import { OrdersService } from '../services/orders.service';

@Injectable()
export class CreateOrderUseCase {
  constructor(private readonly ordersService: OrdersService) {}

  execute(input: CreateOrderDto) {
    return this.ordersService.create(input);
  }
}
