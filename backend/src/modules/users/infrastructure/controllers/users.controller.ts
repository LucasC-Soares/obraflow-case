import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from '../../application/dtos/create-user.dto';
import { CreateUserUseCase } from '../../application/use-cases/create-user.use-case';
import { ListUsersUseCase } from '../../application/use-cases/list-users.use-case';

@ApiTags('Users')
@Controller()
export class UsersController {
  constructor(
    private readonly listUsersUseCase: ListUsersUseCase,
    private readonly createUserUseCase: CreateUserUseCase,
  ) {}

  @Get('users')
  @ApiOperation({
    summary: 'Lista todos os usuários',
    description: 'Retorna a lista de todos os usuários cadastrados no sistema.',
  })
  list() {
    return this.listUsersUseCase.execute();
  }

  @Post('users')
  @ApiOperation({
    summary: 'Cria um novo usuário',
    description: 'Cria um novo usuário com base nos dados fornecidos.',
  })
  create(@Body() dto: CreateUserDto) {
    return this.createUserUseCase.execute(dto);
  }
}
