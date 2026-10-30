import { PurchaseOrder } from '../entities/purchase-order.entity';

export const ORDERS_REPOSITORY = Symbol('ORDERS_REPOSITORY');

export type ParsedOrderItem = {
  description: string;
  unit: string;
  quantity: string;
  unitPriceCents: number;
  totalCents: number;
};

export type CreateOrderData = {
  workId: number;
  supplierId: number;
  orderDate: string;
  notes?: string;
  totalCents: number;
  items: ParsedOrderItem[];
};

export interface OrdersRepository {
  list(): Promise<PurchaseOrder[]>;
  getById(orderId: number): Promise<PurchaseOrder | null>;
  create(data: CreateOrderData): Promise<PurchaseOrder | null>;
  decide(
    orderId: number,
    userId: number,
    approve: boolean,
    reason?: string,
  ): Promise<PurchaseOrder | null>;
  toDomainEntity(order: unknown): PurchaseOrder;
}
