import { IsOptional } from 'class-validator';

export class PatchTaskDto {
  @IsOptional()
  title: string;

  @IsOptional()
  description: string;

  @IsOptional()
  completed: boolean;
}
