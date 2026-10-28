import { Injectable } from '@nestjs/common';
import { DecideOrderDto } from '../dtos/decide-order.dto';
import { OrdersService } from '../services/orders.service';

@Injectable()
export class RejectOrderUseCase {
  constructor(private readonly ordersService: OrdersService) {}

  execute(orderId: number, input: DecideOrderDto) {
    return this.ordersService.decide(
      orderId,
      input.userId,
      false,
      input.reason,
    );
  }
}
