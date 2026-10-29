import { Inject, Injectable } from '@nestjs/common';
import {
  WORKS_REPOSITORY,
  WorksRepository,
} from '../../domain/repositories/works.repository';

@Injectable()
export class WorksService {
  constructor(
    @Inject(WORKS_REPOSITORY) private readonly repository: WorksRepository,
  ) {}

  list() {
    return this.repository.list();
  }

  create(name: string) {
    return this.repository.create(name);
  }
}
