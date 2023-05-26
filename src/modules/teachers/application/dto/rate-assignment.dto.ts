import { IsNumber, Max, Min } from 'class-validator';

export class RateAssignmentDTO {
  @IsNumber()
  @Min(0)
  @Max(10)
  readonly rate!: number;
}
