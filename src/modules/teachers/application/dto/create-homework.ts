import { IsDateString, IsNotEmpty, IsString, IsUUID } from 'class-validator';
import * as he from 'he';

export class CreateHomeworkDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  description!: string;

  @IsString()
  @IsNotEmpty()
  @IsDateString()
  closeAt!: string;

  @IsString()
  @IsUUID()
  @IsNotEmpty()
  courseId!: string;

  static scape(data: CreateHomeworkDto) {
    return {
      ...data,
      name: he.encode(data.name),
      description: he.encode(data.description),
    };
  }
}
