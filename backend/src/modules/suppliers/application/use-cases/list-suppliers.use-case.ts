import { Injectable } from '@nestjs/common';
import { SuppliersService } from '../services/suppliers.service';

@Injectable()
export class ListSuppliersUseCase {
  constructor(private readonly service: SuppliersService) {}

  execute() {
    return this.service.list();
  }
}
