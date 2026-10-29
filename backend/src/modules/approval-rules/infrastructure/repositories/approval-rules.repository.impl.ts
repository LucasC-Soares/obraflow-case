import { Inject, Injectable } from '@nestjs/common';
import { and, asc, eq, or } from 'drizzle-orm';
import { DATABASE } from '../../../../database/database.module';
import { Database, DatabaseClient } from '../../../../database/database.types';
import {
  approvalRuleApprovers,
  approvalRules,
  users,
  works,
} from '../../../../database/schema';
import {
  ApprovalRuleInput,
  ApprovalRulesRepository,
} from '../../domain/repositories/approval-rules.repository';

@Injectable()
export class ApprovalRulesRepositoryImpl implements ApprovalRulesRepository {
  constructor(@Inject(DATABASE) private readonly db: Database) {}

  listByWork(workId: number): Promise<unknown[]> {
    return this.listRules(this.db, workId);
  }

  async workExists(workId: number): Promise<boolean> {
    const [work] = await this.db
      .select({ id: works.id })
      .from(works)
      .where(eq(works.id, workId));
    return Boolean(work);
  }

  async findUserIds(ids: number[]): Promise<number[]> {
    if (!ids.length) return [];
    const found = await this.db
      .select({ id: users.id })
      .from(users)
      .where(or(...ids.map((id) => eq(users.id, id))));
    return found.map(({ id }) => id);
  }

  listRangesByWork(workId: number) {
    return this.db
      .select({
        id: approvalRules.id,
        minimumTotalCents: approvalRules.minimumTotalCents,
        maximumTotalCents: approvalRules.maximumTotalCents,
      })
      .from(approvalRules)
      .where(eq(approvalRules.workId, workId));
  }

  async create(workId: number, input: ApprovalRuleInput) {
    return this.db.transaction(async (tx) => {
      const [rule] = await tx
        .insert(approvalRules)
        .values({
          workId,
          minimumTotalCents: input.minimumTotalCents,
          maximumTotalCents: input.maximumTotalCents ?? null,
        })
        .returning();
      await tx.insert(approvalRuleApprovers).values(
        input.approvers.map((approver, index) => ({
          ruleId: rule.id,
          userId: approver.userId,
          position: index + 1,
        })),
      );
      return this.ruleWithApprovers(tx, rule.id);
    });
  }

  async update(workId: number, ruleId: number, input: ApprovalRuleInput) {
    return this.db.transaction(async (tx) => {
      const [rule] = await tx
        .update(approvalRules)
        .set({
          minimumTotalCents: input.minimumTotalCents,
          maximumTotalCents: input.maximumTotalCents ?? null,
        })
        .where(
          and(eq(approvalRules.id, ruleId), eq(approvalRules.workId, workId)),
        )
        .returning();
      if (!rule) return undefined;
      await tx
        .delete(approvalRuleApprovers)
        .where(eq(approvalRuleApprovers.ruleId, ruleId));
      await tx.insert(approvalRuleApprovers).values(
        input.approvers.map((approver, index) => ({
          ruleId,
          userId: approver.userId,
          position: index + 1,
        })),
      );
      return this.ruleWithApprovers(tx, ruleId);
    });
  }

  async remove(workId: number, ruleId: number): Promise<boolean> {
    const deleted = await this.db
      .delete(approvalRules)
      .where(
        and(eq(approvalRules.id, ruleId), eq(approvalRules.workId, workId)),
      )
      .returning({ id: approvalRules.id });
    return deleted.length > 0;
  }

  private async listRules(db: DatabaseClient, workId: number) {
    const rules = await db
      .select()
      .from(approvalRules)
      .where(eq(approvalRules.workId, workId))
      .orderBy(asc(approvalRules.minimumTotalCents));
    return Promise.all(
      rules.map(async (rule) => ({
        ...rule,
        approvers: await this.approvers(db, rule.id),
      })),
    );
  }

  private ruleWithApprovers(db: DatabaseClient, ruleId: number) {
    return db
      .select()
      .from(approvalRules)
      .where(eq(approvalRules.id, ruleId))
      .then(async ([rule]) =>
        rule ? { ...rule, approvers: await this.approvers(db, rule.id) } : rule,
      );
  }

  private approvers(db: DatabaseClient, ruleId: number) {
    return db
      .select({
        id: approvalRuleApprovers.id,
        position: approvalRuleApprovers.position,
        userId: users.id,
        userName: users.name,
      })
      .from(approvalRuleApprovers)
      .innerJoin(users, eq(users.id, approvalRuleApprovers.userId))
      .where(eq(approvalRuleApprovers.ruleId, ruleId))
      .orderBy(asc(approvalRuleApprovers.position));
  }
}
