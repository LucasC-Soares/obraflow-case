import { Module } from '@nestjs/common';
import { CatalogController } from './infrastructure/controllers/catalog.controller';
import { CatalogService } from './application/services/catalog.service';
import { CatalogRepositoryImpl } from './infrastructure/repositories/catalog.repository.impl';
import { CreateSupplierUseCase } from './application/use-cases/create-supplier.use-case';
import { CreateUserUseCase } from './application/use-cases/create-user.use-case';
import { CreateWorkUseCase } from './application/use-cases/create-work.use-case';
import { ListSuppliersUseCase } from './application/use-cases/list-suppliers.use-case';
import { ListUsersUseCase } from './application/use-cases/list-users.use-case';
import { ListWorksUseCase } from './application/use-cases/list-works.use-case';

@Module({
  controllers: [CatalogController],
  providers: [
    CatalogService,
    CatalogRepositoryImpl,
    CreateSupplierUseCase,
    CreateUserUseCase,
    CreateWorkUseCase,
    ListSuppliersUseCase,
    ListUsersUseCase,
    ListWorksUseCase,
  ],
})
export class CatalogModule {}
