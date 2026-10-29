import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    description: 'Nome do usuário',
    example: 'João da Silva',
  })
  @IsString()
  @IsNotEmpty()
  @Length(1, 180)
  name!: string;

  @ApiProperty({
    description: 'Email do usuário',
    example: 'example@example.com',
  })
  @IsString()
  @IsNotEmpty()
  @Length(1, 180)
  @IsEmail()
  email!: string;
}
