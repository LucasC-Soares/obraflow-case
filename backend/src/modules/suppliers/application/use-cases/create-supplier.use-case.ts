import { Injectable } from '@nestjs/common';
import { CreateSupplierDto } from '../dtos/create-supplier.dto';
import { SuppliersService } from '../services/suppliers.service';

@Injectable()
export class CreateSupplierUseCase {
  constructor(private readonly service: SuppliersService) {}

  execute(input: CreateSupplierDto) {
    return this.service.create(input);
  }
}
