import { Injectable } from '@nestjs/common';
import { OrdersService } from '../services/orders.service';
import { ListOrdersResponseDataDto } from '../dtos/list-order.dto';

@Injectable()
export class ListOrdersUseCase {
  constructor(private readonly ordersService: OrdersService) {}

  async execute(): Promise<ListOrdersResponseDataDto[]> {
    const result = this.ordersService.list();
    return result.then((orders) => {
      return orders.map((order) => ({
        orderId: order.id,
        status: order.status,
      }));
    });
  }
}
