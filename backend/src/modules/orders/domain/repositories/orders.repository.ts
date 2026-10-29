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
  list(): Promise<unknown[]>;
  getById(orderId: number): Promise<unknown>;
  create(data: CreateOrderData): Promise<unknown>;
  decide(
    orderId: number,
    userId: number,
    approve: boolean,
    reason?: string,
  ): Promise<unknown>;
}
