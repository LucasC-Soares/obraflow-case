import { Injectable } from '@nestjs/common';
import { CatalogService } from '../services/catalog.service';

@Injectable()
export class ListUsersUseCase {
  constructor(private readonly service: CatalogService) {}
  execute() {
    return this.service.listUsers();
  }
}
