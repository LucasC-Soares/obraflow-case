import {
  ArrayMinSize,
  IsArray,
  IsInt,
  IsOptional,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class ApprovalRuleApproverDto {
  @ApiProperty({
    description: 'ID do usuário aprovador',
    example: 1,
  })
  @IsInt()
  @Min(1)
  userId!: number;
}

export class SaveApprovalRuleDto {
  @ApiProperty({
    description:
      'Mínimo total do pedido em centavos para que a regra seja aplicada',
    example: 1000,
  })
  @IsInt()
  @Min(0)
  minimumTotalCents!: number;

  @ApiProperty({
    description:
      'Máximo total do pedido em centavos para que a regra seja aplicada',
    example: 10000,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  maximumTotalCents?: number;

  @ApiProperty({
    description: 'Lista de aprovadores da regra',
    type: [ApprovalRuleApproverDto],
  })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => ApprovalRuleApproverDto)
  approvers!: ApprovalRuleApproverDto[];
}
