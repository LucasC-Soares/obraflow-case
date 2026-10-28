import { IsInt, IsOptional, IsPositive, IsString } from 'class-validator';

export class DecideOrderDto {
  @IsInt()
  @IsPositive()
  userId!: number;

  @IsOptional()
  @IsString()
  reason?: string;
}
