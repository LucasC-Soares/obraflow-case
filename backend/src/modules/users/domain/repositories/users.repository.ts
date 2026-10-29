export const USERS_REPOSITORY = Symbol('USERS_REPOSITORY');

export interface UsersRepository {
  list(): Promise<unknown[]>;
  create(data: { name: string; email: string }): Promise<unknown[]>;
}
