import { Injectable } from '@nestjs/common';
import { CreateWorkDto } from '../dtos/create-work.dto';
import { CatalogService } from '../services/catalog.service';

@Injectable()
export class CreateWorkUseCase {
  constructor(private readonly service: CatalogService) {}
  execute(input: CreateWorkDto) {
    return this.service.createWork(input.name);
  }
}
