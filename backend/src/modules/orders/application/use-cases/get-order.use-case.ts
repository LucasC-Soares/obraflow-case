import { Injectable } from '@nestjs/common';
import { OrdersService } from '../services/orders.service';

@Injectable()
export class GetOrderUseCase {
  constructor(private readonly ordersService: OrdersService) {}

  execute(orderId: number) {
    return this.ordersService.get(orderId);
  }
}
