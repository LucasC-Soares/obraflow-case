export const WORKS_REPOSITORY = Symbol('WORKS_REPOSITORY');

export interface WorksRepository {
  list(): Promise<unknown[]>;
  create(name: string): Promise<unknown[]>;
}
