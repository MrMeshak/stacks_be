import { IsArray, IsUUID, ValidateNested } from 'class-validator';

export class StackMoveDto {
  @IsUUID()
  projectId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @IsUUID()
  stackOrder: string[];
}
