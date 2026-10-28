import { Injectable } from '@nestjs/common';
import { ApprovalRulesService } from '../services/approval-rules.service';

@Injectable()
export class ListApprovalRulesUseCase {
  constructor(private readonly service: ApprovalRulesService) {}

  execute(workId: number) {
    return this.service.list(workId);
  }
}
