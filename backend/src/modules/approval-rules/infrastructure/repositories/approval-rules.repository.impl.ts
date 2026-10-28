import { Inject, Injectable } from '@nestjs/common';
import { asc, eq } from 'drizzle-orm';
import { DATABASE } from '../../../../database/database.module';
import { Database } from '../../../../database/database.types';
import { approvalRules } from '../../../../database/schema';
import { ApprovalRulesRepository } from '../../domain/repositories/approval-rules.repository';

@Injectable()
export class ApprovalRulesRepositoryImpl implements ApprovalRulesRepository {
  constructor(@Inject(DATABASE) private readonly db: Database) {}

  listByWork(workId: number): Promise<unknown[]> {
    return this.db
      .select()
      .from(approvalRules)
      .where(eq(approvalRules.workId, workId))
      .orderBy(asc(approvalRules.minimumTotalCents));
  }
}
