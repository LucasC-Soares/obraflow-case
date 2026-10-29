import { Inject, Injectable } from '@nestjs/common';
import {
  SUPPLIERS_REPOSITORY,
  SuppliersRepository,
} from '../../domain/repositories/suppliers.repository';

@Injectable()
export class SuppliersService {
  constructor(
    @Inject(SUPPLIERS_REPOSITORY)
    private readonly repository: SuppliersRepository,
  ) {}

  list() {
    return this.repository.list();
  }

  create(data: { name: string; document: string }) {
    return this.repository.create(data);
  }
}
