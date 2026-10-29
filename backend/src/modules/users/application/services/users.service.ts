import { Inject, Injectable } from '@nestjs/common';
import {
  USERS_REPOSITORY,
  UsersRepository,
} from '../../domain/repositories/users.repository';

@Injectable()
export class UsersService {
  constructor(
    @Inject(USERS_REPOSITORY) private readonly repository: UsersRepository,
  ) {}

  list() {
    return this.repository.list();
  }

  create(data: { name: string; email: string }) {
    return this.repository.create(data);
  }
}
