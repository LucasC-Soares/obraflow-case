import { Module } from '@nestjs/common';
import { OrdersController } from './infrastructure/controllers/orders.controller';
import { OrdersService } from './application/services/orders.service';
import { ApproveOrderUseCase } from './application/use-cases/approve-order.use-case';
import { CreateOrderUseCase } from './application/use-cases/create-order.use-case';
import { GetOrderUseCase } from './application/use-cases/get-order.use-case';
import { ListOrdersUseCase } from './application/use-cases/list-orders.use-case';
import { RejectOrderUseCase } from './application/use-cases/reject-order.use-case';
import { OrdersRepositoryImpl } from './infrastructure/repositories/orders.repository.impl';

@Module({
  controllers: [OrdersController],
  providers: [
    OrdersService,
    OrdersRepositoryImpl,
    ApproveOrderUseCase,
    CreateOrderUseCase,
    GetOrderUseCase,
    ListOrdersUseCase,
    RejectOrderUseCase,
  ],
})
export class OrdersModule {}
