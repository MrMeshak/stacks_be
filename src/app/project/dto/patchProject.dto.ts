import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class PatchProjectDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  stackOrder: string[];
}
