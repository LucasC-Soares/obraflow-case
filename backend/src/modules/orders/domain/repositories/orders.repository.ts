export interface OrdersRepository {
  getById(orderId: number): Promise<unknown>;
}
