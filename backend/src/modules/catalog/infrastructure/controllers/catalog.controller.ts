import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateSupplierDto } from '../../application/dtos/create-supplier.dto';
import { CreateUserDto } from '../../application/dtos/create-user.dto';
import { CreateWorkDto } from '../../application/dtos/create-work.dto';
import { CreateSupplierUseCase } from '../../application/use-cases/create-supplier.use-case';
import { CreateUserUseCase } from '../../application/use-cases/create-user.use-case';
import { CreateWorkUseCase } from '../../application/use-cases/create-work.use-case';
import { ListSuppliersUseCase } from '../../application/use-cases/list-suppliers.use-case';
import { ListUsersUseCase } from '../../application/use-cases/list-users.use-case';
import { ListWorksUseCase } from '../../application/use-cases/list-works.use-case';

@Controller()
export class CatalogController {
  constructor(
    private readonly listWorksUseCase: ListWorksUseCase,
    private readonly createWorkUseCase: CreateWorkUseCase,
    private readonly listUsersUseCase: ListUsersUseCase,
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly listSuppliersUseCase: ListSuppliersUseCase,
    private readonly createSupplierUseCase: CreateSupplierUseCase,
  ) {}

  @Get('works')
  listWorks() {
    return this.listWorksUseCase.execute();
  }

  @Post('works')
  createWork(@Body() dto: CreateWorkDto) {
    return this.createWorkUseCase.execute(dto);
  }

  @Get('users')
  listUsers() {
    return this.listUsersUseCase.execute();
  }

  @Post('users')
  createUser(@Body() dto: CreateUserDto) {
    return this.createUserUseCase.execute(dto);
  }

  @Get('suppliers')
  listSuppliers() {
    return this.listSuppliersUseCase.execute();
  }

  @Post('suppliers')
  createSupplier(@Body() dto: CreateSupplierDto) {
    return this.createSupplierUseCase.execute(dto);
  }
}
