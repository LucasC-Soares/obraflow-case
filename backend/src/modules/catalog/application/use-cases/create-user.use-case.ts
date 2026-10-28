import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '../dtos/create-user.dto';
import { CatalogService } from '../services/catalog.service';

@Injectable()
export class CreateUserUseCase {
  constructor(private readonly service: CatalogService) {}
  execute(input: CreateUserDto) {
    return this.service.createUser(input);
  }
}
