import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { asc, eq } from 'drizzle-orm';
import { DATABASE } from '../../../../database/database.module';
import { Database } from '../../../../database/database.types';
import {
  purchaseOrderApprovals,
  purchaseOrderItems,
  purchaseOrders,
} from '../../../../database/schema';
import { OrdersRepository } from '../../domain/repositories/orders.repository';

@Injectable()
export class OrdersRepositoryImpl implements OrdersRepository {
  constructor(@Inject(DATABASE) private readonly db: Database) {}

  async getById(orderId: number): Promise<unknown> {
    const [order] = await this.db
      .select()
      .from(purchaseOrders)
      .where(eq(purchaseOrders.id, orderId));
    if (!order) throw new NotFoundException('Pedido não encontrado.');

    const [items, approvals] = await Promise.all([
      this.db
        .select()
        .from(purchaseOrderItems)
        .where(eq(purchaseOrderItems.orderId, orderId)),
      this.db
        .select()
        .from(purchaseOrderApprovals)
        .where(eq(purchaseOrderApprovals.orderId, orderId))
        .orderBy(asc(purchaseOrderApprovals.position)),
    ]);

    return { ...order, items, approvals };
  }
}
