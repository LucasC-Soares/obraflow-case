import {
  IsArray,
  IsInt,
  IsOptional,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class ApprovalRuleApproverDto {
  @IsInt()
  @Min(1)
  userId!: number;
}

export class SaveApprovalRuleDto {
  @IsInt()
  @Min(0)
  minimumTotalCents!: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  maximumTotalCents?: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ApprovalRuleApproverDto)
  approvers!: ApprovalRuleApproverDto[];
}
