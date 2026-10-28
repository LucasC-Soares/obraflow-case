import { Injectable } from '@nestjs/common';
import { SaveApprovalRuleDto } from '../dtos/save-approval-rule.dto';
import { ApprovalRulesService } from '../services/approval-rules.service';

@Injectable()
export class CreateApprovalRuleUseCase {
  constructor(private readonly service: ApprovalRulesService) {}

  execute(workId: number, input: SaveApprovalRuleDto) {
    return this.service.create(workId, input);
  }
}
