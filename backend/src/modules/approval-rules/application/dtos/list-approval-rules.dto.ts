import { IsInt, IsPositive } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ListApprovalRulesDto {
  @ApiProperty({
    description: 'ID da obra',
    example: 1,
  })
  @IsInt()
  @IsPositive()
  workId!: number;
}
