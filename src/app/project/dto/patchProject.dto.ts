import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class PatchProjectDto {
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  stackOrder: string[];
}
