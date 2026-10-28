import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { and, asc, desc, eq, gte, lte, or, isNull } from 'drizzle-orm';
import { DATABASE } from '../../../../database/database.module';
import { Database, DatabaseClient } from '../../../../database/database.types';
import {
  approvalRuleApprovers,
  approvalRules,
  purchaseOrderApprovals,
  purchaseOrderItems,
  purchaseOrders,
  suppliers,
  users,
  works,
} from '../../../../database/schema';

type ItemInput = {
  description: string;
  unit: string;
  quantity: string;
  unitPriceCents: number;
};
type OrderInput = {
  workId: number;
  supplierId: number;
  orderDate: string;
  notes?: string;
  items: ItemInput[];
};

@Injectable()
export class OrdersService {
  constructor(@Inject(DATABASE) private readonly db: Database) {}

  async list() {
    return this.db
      .select({
        id: purchaseOrders.id,
        status: purchaseOrders.status,
        orderDate: purchaseOrders.orderDate,
        totalCents: purchaseOrders.totalCents,
        work: works.name,
        supplier: suppliers.name,
      })
      .from(purchaseOrders)
      .innerJoin(works, eq(works.id, purchaseOrders.workId))
      .innerJoin(suppliers, eq(suppliers.id, purchaseOrders.supplierId))
      .orderBy(desc(purchaseOrders.createdAt));
  }

  async get(id: number) {
    const [order] = await this.db
      .select()
      .from(purchaseOrders)
      .where(eq(purchaseOrders.id, id));
    if (!order) throw new NotFoundException('Pedido não encontrado.');
    const [items, approvals] = await Promise.all([
      this.db
        .select()
        .from(purchaseOrderItems)
        .where(eq(purchaseOrderItems.orderId, id)),
      this.db
        .select({
          id: purchaseOrderApprovals.id,
          position: purchaseOrderApprovals.position,
          status: purchaseOrderApprovals.status,
          decidedAt: purchaseOrderApprovals.decidedAt,
          rejectionReason: purchaseOrderApprovals.rejectionReason,
          approverId: users.id,
          approverName: users.name,
        })
        .from(purchaseOrderApprovals)
        .innerJoin(users, eq(users.id, purchaseOrderApprovals.approverId))
        .where(eq(purchaseOrderApprovals.orderId, id))
        .orderBy(asc(purchaseOrderApprovals.position)),
    ]);
    return { ...order, items, approvals };
  }

  async create(input: OrderInput) {
    if (!input.items?.length)
      throw new BadRequestException('O pedido precisa ter ao menos um item.');
    const parsedItems = input.items.map((item) => {
      const quantity = Number(item.quantity);
      if (!Number.isFinite(quantity) || quantity <= 0)
        throw new BadRequestException(
          `Quantidade inválida no item "${item.description}".`,
        );
      if (!Number.isInteger(item.unitPriceCents) || item.unitPriceCents < 0)
        throw new BadRequestException(
          `Preço inválido no item "${item.description}".`,
        );
      const totalCents = Math.round(quantity * item.unitPriceCents);
      return { ...item, quantity: quantity.toFixed(3), totalCents };
    });
    const totalCents = parsedItems.reduce(
      (total, item) => total + item.totalCents,
      0,
    );

    return this.db.transaction(async (tx) => {
      const [work] = await tx
        .select({ id: works.id })
        .from(works)
        .where(eq(works.id, input.workId));
      const [supplier] = await tx
        .select({ id: suppliers.id })
        .from(suppliers)
        .where(eq(suppliers.id, input.supplierId));
      if (!work) throw new NotFoundException('Obra não encontrada.');
      if (!supplier) throw new NotFoundException('Fornecedor não encontrado.');
      const [rule] = await tx
        .select()
        .from(approvalRules)
        .where(
          and(
            eq(approvalRules.workId, input.workId),
            lte(approvalRules.minimumTotalCents, totalCents),
            or(
              isNull(approvalRules.maximumTotalCents),
              gte(approvalRules.maximumTotalCents, totalCents),
            ),
          ),
        )
        .orderBy(desc(approvalRules.minimumTotalCents))
        .limit(1);
      if (!rule)
        throw new BadRequestException(
          'Não existe regra de alçada aplicável a este valor.',
        );
      const approvers = await tx
        .select()
        .from(approvalRuleApprovers)
        .where(eq(approvalRuleApprovers.ruleId, rule.id))
        .orderBy(asc(approvalRuleApprovers.position));
      if (!approvers.length)
        throw new ConflictException(
          'A regra selecionada não possui aprovadores.',
        );
      const [order] = await tx
        .insert(purchaseOrders)
        .values({
          workId: input.workId,
          supplierId: input.supplierId,
          orderDate: new Date(input.orderDate),
          notes: input.notes,
          totalCents,
          status: 'PENDING',
        })
        .returning();
      await tx.insert(purchaseOrderItems).values(
        parsedItems.map((item) => ({
          orderId: order.id,
          description: item.description,
          quantity: item.quantity,
          unit: item.unit,
          unitPriceCents: item.unitPriceCents,
          totalCents: item.totalCents,
        })),
      );
      await tx.insert(purchaseOrderApprovals).values(
        approvers.map((approver) => ({
          orderId: order.id,
          approverId: approver.userId,
          position: approver.position,
          status: 'PENDING' as const,
        })),
      );
      return this.getWithClient(tx, order.id);
    });
  }

  async decide(
    orderId: number,
    userId: number,
    approve: boolean,
    reason?: string,
  ) {
    if (!approve && !reason?.trim())
      throw new BadRequestException('O motivo da rejeição é obrigatório.');
    return this.db.transaction(async (tx) => {
      const [order] = await tx
        .select()
        .from(purchaseOrders)
        .where(eq(purchaseOrders.id, orderId));
      if (!order) throw new NotFoundException('Pedido não encontrado.');
      if (order.status !== 'PENDING')
        throw new ConflictException('A cadeia de alçada já foi concluída.');
      const [step] = await tx
        .select()
        .from(purchaseOrderApprovals)
        .where(
          and(
            eq(purchaseOrderApprovals.orderId, orderId),
            eq(purchaseOrderApprovals.status, 'PENDING'),
          ),
        )
        .orderBy(asc(purchaseOrderApprovals.position))
        .limit(1);
      if (!step)
        throw new ConflictException('Nenhuma etapa pendente para este pedido.');
      if (step.approverId !== userId)
        throw new ConflictException('Este usuário não é o aprovador atual.');
      await tx
        .update(purchaseOrderApprovals)
        .set({
          status: approve ? 'APPROVED' : 'REJECTED',
          decidedAt: new Date(),
          rejectionReason: approve ? null : reason!.trim(),
        })
        .where(eq(purchaseOrderApprovals.id, step.id));
      if (!approve)
        await tx
          .update(purchaseOrders)
          .set({ status: 'REJECTED' })
          .where(eq(purchaseOrders.id, orderId));
      else {
        const [next] = await tx
          .select({ id: purchaseOrderApprovals.id })
          .from(purchaseOrderApprovals)
          .where(
            and(
              eq(purchaseOrderApprovals.orderId, orderId),
              eq(purchaseOrderApprovals.status, 'PENDING'),
            ),
          )
          .limit(1);
        if (!next)
          await tx
            .update(purchaseOrders)
            .set({ status: 'APPROVED' })
            .where(eq(purchaseOrders.id, orderId));
      }
      return this.getWithClient(tx, orderId);
    });
  }

  private async getWithClient(db: DatabaseClient, id: number) {
    const [order] = await db
      .select()
      .from(purchaseOrders)
      .where(eq(purchaseOrders.id, id));
    const items = await db
      .select()
      .from(purchaseOrderItems)
      .where(eq(purchaseOrderItems.orderId, id));
    const approvals = await db
      .select()
      .from(purchaseOrderApprovals)
      .where(eq(purchaseOrderApprovals.orderId, id))
      .orderBy(asc(purchaseOrderApprovals.position));
    return { ...order, items, approvals };
  }
}
