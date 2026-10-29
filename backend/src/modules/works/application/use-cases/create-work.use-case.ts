import { Injectable } from '@nestjs/common';
import { CreateWorkDto } from '../dtos/create-work.dto';
import { WorksService } from '../services/works.service';

@Injectable()
export class CreateWorkUseCase {
  constructor(private readonly service: WorksService) {}

  execute(input: CreateWorkDto) {
    return this.service.create(input.name);
  }
}
