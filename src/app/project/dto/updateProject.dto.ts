import { IsNotEmpty, IsString } from 'class-validator';

export class updateProjectDto {
  @IsString()
  @IsNotEmpty()
  title: string;
}
