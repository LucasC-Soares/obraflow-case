import { Injectable } from '@nestjs/common';
import { WorksService } from '../services/works.service';

@Injectable()
export class ListWorksUseCase {
  constructor(private readonly service: WorksService) {}

  execute() {
    return this.service.list();
  }
}
