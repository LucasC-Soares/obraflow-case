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
import { SaveApprovalRuleDto } from '../../application/dtos/save-approval-rule.dto';
import { CreateApprovalRuleUseCase } from '../../application/use-cases/create-approval-rule.use-case';
import { DeleteApprovalRuleUseCase } from '../../application/use-cases/delete-approval-rule.use-case';
import { ListApprovalRulesUseCase } from '../../application/use-cases/list-approval-rules.use-case';
import { UpdateApprovalRuleUseCase } from '../../application/use-cases/update-approval-rule.use-case';

@Controller('works/:workId/approval-rules')
export class ApprovalRulesController {
  constructor(
    private readonly listRules: ListApprovalRulesUseCase,
    private readonly createRule: CreateApprovalRuleUseCase,
    private readonly updateRule: UpdateApprovalRuleUseCase,
    private readonly deleteRule: DeleteApprovalRuleUseCase,
  ) {}

  @Get()
  list(@Param('workId', ParseIntPipe) workId: number) {
    return this.listRules.execute(workId);
  }

  @Post()
  create(
    @Param('workId', ParseIntPipe) workId: number,
    @Body() dto: SaveApprovalRuleDto,
  ) {
    return this.createRule.execute(workId, dto);
  }

  @Patch(':ruleId')
  update(
    @Param('workId', ParseIntPipe) workId: number,
    @Param('ruleId', ParseIntPipe) ruleId: number,
    @Body() dto: SaveApprovalRuleDto,
  ) {
    return this.updateRule.execute(workId, ruleId, dto);
  }

  @Delete(':ruleId')
  remove(
    @Param('workId', ParseIntPipe) workId: number,
    @Param('ruleId', ParseIntPipe) ruleId: number,
  ) {
    return this.deleteRule.execute(workId, ruleId);
  }
}
