import { IsArray, IsUUID, ValidateNested } from 'class-validator';

export class StackMoveDto {
  @IsUUID()
  projectId: string;

  @IsArray()
  @IsUUID('all', { each: true })
  stackOrder: string[];
}
