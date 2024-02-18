import { IsHexColor, IsNotEmpty, IsString } from 'class-validator';

export class UpdateStackDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsHexColor()
  color: string;
}
