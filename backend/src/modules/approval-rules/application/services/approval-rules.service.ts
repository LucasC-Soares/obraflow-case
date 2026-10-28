import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { and, asc, eq, or } from 'drizzle-orm';
import { DATABASE } from '../../../../database/database.module';
import { DatabaseClient, Database } from '../../../../database/database.types';
import {
  approvalRuleApprovers,
  approvalRules,
  users,
  works,
} from '../../../../database/schema';

type RuleInput = {
  minimumTotalCents: number;
  maximumTotalCents?: number;
  approvers: { userId: number }[];
};

@Injectable()
export class ApprovalRulesService {
  constructor(@Inject(DATABASE) private readonly db: Database) {}

  async list(workId: number) {
    const rules = await this.db
      .select()
      .from(approvalRules)
      .where(eq(approvalRules.workId, workId))
      .orderBy(asc(approvalRules.minimumTotalCents));
    return Promise.all(
      rules.map(async (rule) => ({
        ...rule,
        approvers: await this.approvers(this.db, rule.id),
      })),
    );
  }

  async create(workId: number, input: RuleInput) {
    await this.validate(workId, input);
    return this.db.transaction(async (tx) => this.save(tx, workId, input));
  }

  async update(workId: number, ruleId: number, input: RuleInput) {
    await this.validate(workId, input, ruleId);
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
      if (!rule) throw new NotFoundException('Regra de alçada não encontrada.');
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
      return { ...rule, approvers: await this.approvers(tx, ruleId) };
    });
  }

  async remove(workId: number, ruleId: number) {
    const deleted = await this.db
      .delete(approvalRules)
      .where(
        and(eq(approvalRules.id, ruleId), eq(approvalRules.workId, workId)),
      )
      .returning({ id: approvalRules.id });
    if (!deleted.length)
      throw new NotFoundException('Regra de alçada não encontrada.');
    return { deleted: true };
  }

  private async save(db: DatabaseClient, workId: number, input: RuleInput) {
    const [rule] = await db
      .insert(approvalRules)
      .values({
        workId,
        minimumTotalCents: input.minimumTotalCents,
        maximumTotalCents: input.maximumTotalCents ?? null,
      })
      .returning();
    await db.insert(approvalRuleApprovers).values(
      input.approvers.map((approver, index) => ({
        ruleId: rule.id,
        userId: approver.userId,
        position: index + 1,
      })),
    );
    return { ...rule, approvers: await this.approvers(db, rule.id) };
  }

  private async validate(
    workId: number,
    input: RuleInput,
    ignoredRuleId?: number,
  ) {
    if (!input.approvers.length)
      throw new BadRequestException(
        'A regra precisa de ao menos um aprovador.',
      );
    if (
      input.maximumTotalCents !== undefined &&
      input.maximumTotalCents < input.minimumTotalCents
    ) {
      throw new BadRequestException(
        'O limite máximo não pode ser menor que o mínimo.',
      );
    }
    const [work] = await this.db
      .select({ id: works.id })
      .from(works)
      .where(eq(works.id, workId));
    if (!work) throw new NotFoundException('Obra não encontrada.');
    const ids = input.approvers.map(({ userId }) => userId);
    if (new Set(ids).size !== ids.length)
      throw new BadRequestException(
        'Um aprovador não pode aparecer duas vezes na mesma regra.',
      );
    const found = await this.db
      .select({ id: users.id })
      .from(users)
      .where(or(...ids.map((id) => eq(users.id, id))));
    if (found.length !== ids.length)
      throw new BadRequestException('Um ou mais aprovadores não existem.');
    const existingRules = await this.db
      .select({
        id: approvalRules.id,
        minimumTotalCents: approvalRules.minimumTotalCents,
        maximumTotalCents: approvalRules.maximumTotalCents,
      })
      .from(approvalRules)
      .where(eq(approvalRules.workId, workId));
    const conflicts = existingRules.some((rule) => {
      if (rule.id === ignoredRuleId) return false;
      const newMaximum = input.maximumTotalCents ?? Number.MAX_SAFE_INTEGER;
      const currentMaximum = rule.maximumTotalCents ?? Number.MAX_SAFE_INTEGER;
      return (
        input.minimumTotalCents <= currentMaximum &&
        rule.minimumTotalCents <= newMaximum
      );
    });
    if (conflicts)
      throw new BadRequestException(
        'Já existe uma regra para esta faixa da obra.',
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
