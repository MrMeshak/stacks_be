import { IsHexColor, IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateStackDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsHexColor()
  color: string;
}
