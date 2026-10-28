export interface ApprovalRulesRepository {
  listByWork(workId: number): Promise<unknown[]>;
}
