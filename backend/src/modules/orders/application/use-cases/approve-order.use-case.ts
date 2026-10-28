import { Injectable } from '@nestjs/common';
import { OrdersService } from '../services/orders.service';

@Injectable()
export class ApproveOrderUseCase {
  constructor(private readonly ordersService: OrdersService) {}

  execute(orderId: number, userId: number) {
    return this.ordersService.decide(orderId, userId, true);
  }
}
