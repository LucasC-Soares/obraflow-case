import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateWorkDto {
  @IsString()
  @IsNotEmpty()
  @Length(1, 180)
  name!: string;
}
