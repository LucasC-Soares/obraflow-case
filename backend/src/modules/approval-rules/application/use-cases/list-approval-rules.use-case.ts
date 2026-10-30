import { Injectable } from '@nestjs/common';
import { ApprovalRulesService } from '../services/approval-rules.service';
import { ListApprovalRulesResponseDataDto } from '../dtos/list-approval-rules.dto';

@Injectable()
export class ListApprovalRulesUseCase {
  constructor(private readonly service: ApprovalRulesService) {}

  async execute(workId: number): Promise<ListApprovalRulesResponseDataDto> {
    const result = this.service.list(workId);
    return result.then((approvalRules) => {
      return {
        data: approvalRules.map((approvalRule) => ({
          workId: approvalRule.workId,
          minimumTotalCents: approvalRule.minimumTotalCents,
          maximumTotalCents: approvalRule.maximumTotalCents ?? undefined,
          approvers: (approvalRule.approvers ?? []).map((approver) => ({
            userId: approver.userId,
          })),
        })),
      };
    });
  }
}
