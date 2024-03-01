import { IsArray, IsUUID } from 'class-validator';

export class TaskMoveDto {
  @IsUUID()
  taskId: string;

  @IsUUID()
  fromStackId: string;

  @IsArray()
  @IsUUID('all', { each: true })
  fromStackTaskOrder: string[];

  @IsUUID()
  toStackId: string;

  @IsArray()
  @IsUUID('all', { each: true })
  toStackTaskOrder: string[];
}
