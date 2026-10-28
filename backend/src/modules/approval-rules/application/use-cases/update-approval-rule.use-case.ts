import { Injectable } from '@nestjs/common';
import { SaveApprovalRuleDto } from '../dtos/save-approval-rule.dto';
import { ApprovalRulesService } from '../services/approval-rules.service';

@Injectable()
export class UpdateApprovalRuleUseCase {
  constructor(private readonly service: ApprovalRulesService) {}

  execute(workId: number, ruleId: number, input: SaveApprovalRuleDto) {
    return this.service.update(workId, ruleId, input);
  }
}
