import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateWorkDto } from '../../application/dtos/create-work.dto';
import { CreateWorkUseCase } from '../../application/use-cases/create-work.use-case';
import { ListWorksUseCase } from '../../application/use-cases/list-works.use-case';

@ApiTags('Works')
@Controller()
export class WorksController {
  constructor(
    private readonly listWorksUseCase: ListWorksUseCase,
    private readonly createWorkUseCase: CreateWorkUseCase,
  ) {}

  @Get('works')
  @ApiOperation({
    summary: 'Lista todas as obras',
    description: 'Retorna a lista de todas as obras cadastradas no sistema.',
  })
  list() {
    return this.listWorksUseCase.execute();
  }

  @Post('works')
  @ApiOperation({
    summary: 'Cria uma nova obra',
    description: 'Cria uma nova obra com base nos dados fornecidos.',
  })
  create(@Body() dto: CreateWorkDto) {
    return this.createWorkUseCase.execute(dto);
  }
}
