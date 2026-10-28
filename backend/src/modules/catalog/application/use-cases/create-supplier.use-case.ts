import { Injectable } from '@nestjs/common';
import { CreateSupplierDto } from '../dtos/create-supplier.dto';
import { CatalogService } from '../services/catalog.service';

@Injectable()
export class CreateSupplierUseCase {
  constructor(private readonly service: CatalogService) {}
  execute(input: CreateSupplierDto) {
    return this.service.createSupplier(input);
  }
}
