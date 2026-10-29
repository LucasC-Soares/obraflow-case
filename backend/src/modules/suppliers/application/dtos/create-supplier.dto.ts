import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateSupplierDto {
  @ApiProperty({
    description: 'O nome do fornecedor',
    example: 'Fornecedor Exemplo',
  })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({
    description: 'O documento do fornecedor (CNPJ ou CPF)',
    example: '123456789',
  })
  @IsString()
  @IsNotEmpty()
  document!: string;
}
