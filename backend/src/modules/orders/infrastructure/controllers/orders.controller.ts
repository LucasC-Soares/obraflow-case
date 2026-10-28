import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { CreateOrderDto } from '../../application/dtos/create-order.dto';
import { DecideOrderDto } from '../../application/dtos/decide-order.dto';
import { ApproveOrderUseCase } from '../../application/use-cases/approve-order.use-case';
import { CreateOrderUseCase } from '../../application/use-cases/create-order.use-case';
import { GetOrderUseCase } from '../../application/use-cases/get-order.use-case';
import { ListOrdersUseCase } from '../../application/use-cases/list-orders.use-case';
import { RejectOrderUseCase } from '../../application/use-cases/reject-order.use-case';

@Controller('orders')
export class OrdersController {
  constructor(
    private readonly listOrders: ListOrdersUseCase,
    private readonly getOrder: GetOrderUseCase,
    private readonly createOrder: CreateOrderUseCase,
    private readonly approveOrder: ApproveOrderUseCase,
    private readonly rejectOrder: RejectOrderUseCase,
  ) {}
  @Get() list() {
    return this.listOrders.execute();
  }
  @Get(':id') get(@Param('id', ParseIntPipe) id: number) {
    return this.getOrder.execute(id);
  }
  @Post() create(@Body() dto: CreateOrderDto) {
    return this.createOrder.execute(dto);
  }
  @Post(':id/approve') approve(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: DecideOrderDto,
  ) {
    return this.approveOrder.execute(id, dto.userId);
  }
  @Post(':id/reject') reject(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: DecideOrderDto,
  ) {
    return this.rejectOrder.execute(id, dto);
  }
}
