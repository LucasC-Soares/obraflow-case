import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { SaveApprovalRuleDto } from '../../application/dtos/save-approval-rule.dto';
import { CreateApprovalRuleUseCase } from '../../application/use-cases/create-approval-rule.use-case';
import { DeleteApprovalRuleUseCase } from '../../application/use-cases/delete-approval-rule.use-case';
import { ListApprovalRulesUseCase } from '../../application/use-cases/list-approval-rules.use-case';
import { UpdateApprovalRuleUseCase } from '../../application/use-cases/update-approval-rule.use-case';

@ApiTags('Approval Rules')
@Controller('works/:workId/approval-rules')
export class ApprovalRulesController {
  constructor(
    private readonly listRules: ListApprovalRulesUseCase,
    private readonly createRule: CreateApprovalRuleUseCase,
    private readonly updateRule: UpdateApprovalRuleUseCase,
    private readonly deleteRule: DeleteApprovalRuleUseCase,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Listar regras de aprovação',
    description: 'Lista todas as regras de aprovação de uma obra',
  })
  @ApiParam({
    name: 'workId',
    description: 'ID da obra',
    type: Number,
  })
  list(@Param('workId', ParseIntPipe) workId: number) {
    return this.listRules.execute(workId);
  }

  @Post()
  @ApiOperation({
    summary: 'Criar regra de aprovação',
    description: 'Cria uma nova regra de aprovação para uma obra',
  })
  @ApiParam({
    name: 'workId',
    description: 'ID da obra',
    type: Number,
  })
  create(
    @Param('workId', ParseIntPipe) workId: number,
    @Body() dto: SaveApprovalRuleDto,
  ) {
    return this.createRule.execute(workId, dto);
  }

  @Patch(':ruleId')
  @ApiOperation({
    summary: 'Atualizar regra de aprovação',
    description: 'Atualiza uma regra de aprovação existente para uma obra',
  })
  @ApiParam({
    name: 'workId',
    description: 'ID da obra',
    type: Number,
  })
  @ApiParam({
    name: 'ruleId',
    description: 'ID da regra de aprovação',
    type: Number,
  })
  update(
    @Param('workId', ParseIntPipe) workId: number,
    @Param('ruleId', ParseIntPipe) ruleId: number,
    @Body() dto: SaveApprovalRuleDto,
  ) {
    return this.updateRule.execute(workId, ruleId, dto);
  }

  @Delete(':ruleId')
  @ApiOperation({
    summary: 'Deletar regra de aprovação',
    description: 'Deleta uma regra de aprovação existente para uma obra',
  })
  @ApiParam({
    name: 'workId',
    description: 'ID da obra',
    type: Number,
  })
  @ApiParam({
    name: 'ruleId',
    description: 'ID da regra de aprovação',
    type: Number,
  })
  remove(
    @Param('workId', ParseIntPipe) workId: number,
    @Param('ruleId', ParseIntPipe) ruleId: number,
  ) {
    return this.deleteRule.execute(workId, ruleId);
  }
}
