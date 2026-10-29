import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateWorkDto {
  @ApiProperty({
    description: 'O nome da obra',
    example: 'Obra Exemplo',
  })
  @IsString()
  @IsNotEmpty()
  @Length(1, 180)
  name!: string;
}
