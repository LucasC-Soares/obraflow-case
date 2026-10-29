import { IsInt, IsOptional, IsPositive, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class DecideOrderDto {
  @ApiProperty({
    description: 'ID do usuário que está tomando a decisão',
    example: 1,
  })
  @IsInt()
  @IsPositive()
  userId!: number;

  @ApiProperty({
    description: 'Motivo da decisão (opcional)',
    example: 'O pedido não atende aos requisitos.',
  })
  @IsOptional()
  @IsString()
  reason?: string;
}
