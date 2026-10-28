import { IsInt, IsPositive } from 'class-validator';

export class ListApprovalRulesDto {
  @IsInt()
  @IsPositive()
  workId!: number;
}
