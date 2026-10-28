import { Injectable } from '@nestjs/common';
import { OrdersService } from '../services/orders.service';

@Injectable()
export class ListOrdersUseCase {
  constructor(private readonly ordersService: OrdersService) {}

  execute() {
    return this.ordersService.list();
  }
}
