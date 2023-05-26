import { CourseStatus } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsString, Length } from 'class-validator';
import * as he from 'he';

export class CreateCourseDTO {
  @IsString()
  @IsNotEmpty()
  @Length(3, 255)
  name!: string;

  @IsString()
  @IsNotEmpty()
  @Length(3, 255)
  description!: string;

  @IsEnum(CourseStatus)
  status!: CourseStatus;

  static scape(data: CreateCourseDTO) {
    return {
      ...data,
      name: he.encode(data.name),
      description: he.encode(data.description),
    };
  }
}
