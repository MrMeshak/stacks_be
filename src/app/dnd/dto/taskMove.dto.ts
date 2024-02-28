import { IsArray, IsUUID, ValidateNested } from 'class-validator';

export class TaskMoveDto {
  @IsUUID()
  taskId: string;

  @IsUUID()
  fromStackId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @IsUUID()
  fromStackTaskOrder: string[];

  @IsUUID()
  toStackId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @IsUUID()
  toStackTaskOrder: string[];
}
