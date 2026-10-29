import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '../dtos/create-user.dto';
import { UsersService } from '../services/users.service';

@Injectable()
export class CreateUserUseCase {
  constructor(private readonly service: UsersService) {}

  execute(input: CreateUserDto) {
    return this.service.create(input);
  }
}
