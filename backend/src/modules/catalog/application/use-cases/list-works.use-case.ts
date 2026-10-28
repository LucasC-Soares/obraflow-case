import { Injectable } from '@nestjs/common';
import { CatalogService } from '../services/catalog.service';

@Injectable()
export class ListWorksUseCase {
  constructor(private readonly service: CatalogService) {}
  execute() {
    return this.service.listWorks();
  }
}
