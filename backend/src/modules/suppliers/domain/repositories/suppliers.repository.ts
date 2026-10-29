export const SUPPLIERS_REPOSITORY = Symbol('SUPPLIERS_REPOSITORY');

export interface SuppliersRepository {
  list(): Promise<unknown[]>;
  create(data: { name: string; document: string }): Promise<unknown[]>;
}
