import { Injectable } from '@nestjs/common';
import { ApprovalRulesService } from '../services/approval-rules.service';

@Injectable()
export class DeleteApprovalRuleUseCase {
  constructor(private readonly service: ApprovalRulesService) {}

  execute(workId: number, ruleId: number) {
    return this.service.remove(workId, ruleId);
  }
}
