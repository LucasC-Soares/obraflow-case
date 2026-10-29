import { Injectable } from '@nestjs/common';
import { UsersService } from '../services/users.service';

@Injectable()
export class ListUsersUseCase {
  constructor(private readonly service: UsersService) {}

  execute() {
    return this.service.list();
  }
}
