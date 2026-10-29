import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { CreateOrderDto } from '../../application/dtos/create-order.dto';
import { DecideOrderDto } from '../../application/dtos/decide-order.dto';
import { ApproveOrderUseCase } from '../../application/use-cases/approve-order.use-case';
import { CreateOrderUseCase } from '../../application/use-cases/create-order.use-case';
import { GetOrderUseCase } from '../../application/use-cases/get-order.use-case';
import { ListOrdersUseCase } from '../../application/use-cases/list-orders.use-case';
import { RejectOrderUseCase } from '../../application/use-cases/reject-order.use-case';

@ApiTags('Orders')
@Controller('orders')
export class OrdersController {
  constructor(
    private readonly listOrders: ListOrdersUseCase,
    private readonly getOrder: GetOrderUseCase,
    private readonly createOrder: CreateOrderUseCase,
    private readonly approveOrder: ApproveOrderUseCase,
    private readonly rejectOrder: RejectOrderUseCase,
  ) {}
  @Get()
  @ApiOperation({
    summary: 'Lista todos os pedidos',
    description: 'Retorna uma lista de todos os pedidos existentes no sistema',
  })
  list() {
    return this.listOrders.execute();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Recuperar detalhes de um pedido específico',
    description:
      'Retorna os detalhes de um pedido específico com base no ID fornecido',
  })
  @ApiParam({
    name: 'id',
    description: 'ID do pedido',
    type: Number,
  })
  get(@Param('id', ParseIntPipe) id: number) {
    return this.getOrder.execute(id);
  }

  @Post()
  @ApiOperation({
    summary: 'Criar um novo pedido',
    description: 'Cria um novo pedido com base nos dados fornecidos',
  })
  create(@Body() dto: CreateOrderDto) {
    return this.createOrder.execute(dto);
  }

  @Post(':id/approve')
  @ApiOperation({
    summary: 'Aprovar um pedido',
    description: 'Aprova um pedido específico com base no ID fornecido',
  })
  @ApiParam({
    name: 'id',
    description: 'ID do pedido',
    type: Number,
  })
  approve(@Param('id', ParseIntPipe) id: number, @Body() dto: DecideOrderDto) {
    return this.approveOrder.execute(id, dto.userId);
  }

  @Post(':id/reject')
  @ApiOperation({
    summary: 'Rejeitar um pedido',
    description: 'Rejeita um pedido específico com base no ID fornecido',
  })
  @ApiParam({
    name: 'id',
    description: 'ID do pedido',
    type: Number,
  })
  reject(@Param('id', ParseIntPipe) id: number, @Body() dto: DecideOrderDto) {
    return this.rejectOrder.execute(id, dto);
  }
}
