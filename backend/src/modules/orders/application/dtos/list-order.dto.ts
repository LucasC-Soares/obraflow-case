import { IsInt, IsPositive, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ApiResponse } from '../../../../shared/types/index';

export class ListOrdersResponseDataDto {
  @ApiProperty({
    description: 'ID do pedido que foi decidido',
    example: 1,
  })
  @IsInt()
  @IsPositive()
  orderId!: number;

  @ApiProperty({
    description: 'Status do pedido após a decisão',
    example: 'approved',
  })
  @IsString()
  status!: string;
}

export class ListOrdersResponseDto implements ApiResponse {
  @ApiProperty({
    description: 'Indica se a operação foi bem-sucedida',
    example: true,
  })
  success!: boolean;

  @ApiProperty({
    description: 'Dados da decisão do pedido',
  })
  data!: ListOrdersResponseDataDto[];

  @ApiProperty({
    description: 'Mensagem de sucesso ou erro da operação',
    example: 'Pedido aprovado com sucesso.',
  })
  message!: string;
}
