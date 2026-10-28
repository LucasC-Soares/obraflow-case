import { Injectable } from '@nestjs/common';
import { CatalogService } from '../services/catalog.service';

@Injectable()
export class ListSuppliersUseCase {
  constructor(private readonly service: CatalogService) {}
  execute() {
    return this.service.listSuppliers();
  }
}
