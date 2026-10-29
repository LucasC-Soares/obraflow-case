import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateSupplierDto } from '../../application/dtos/create-supplier.dto';
import { CreateSupplierUseCase } from '../../application/use-cases/create-supplier.use-case';
import { ListSuppliersUseCase } from '../../application/use-cases/list-suppliers.use-case';

@ApiTags('Suppliers')
@Controller()
export class SuppliersController {
  constructor(
    private readonly listSuppliersUseCase: ListSuppliersUseCase,
    private readonly createSupplierUseCase: CreateSupplierUseCase,
  ) {}

  @Get('suppliers')
  @ApiOperation({
    summary: 'Lista todos os fornecedores',
    description:
      'Retorna a lista de todos os fornecedores cadastrados no sistema.',
  })
  list() {
    return this.listSuppliersUseCase.execute();
  }

  @Post('suppliers')
  @ApiOperation({
    summary: 'Cria um novo fornecedor',
    description: 'Cria um novo fornecedor com base nos dados fornecidos.',
  })
  create(@Body() dto: CreateSupplierDto) {
    return this.createSupplierUseCase.execute(dto);
  }
}
