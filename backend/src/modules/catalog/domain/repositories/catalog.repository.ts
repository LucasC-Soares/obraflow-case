export interface CatalogRepository {
  listWorks(): Promise<unknown[]>;
  listUsers(): Promise<unknown[]>;
  listSuppliers(): Promise<unknown[]>;
}
