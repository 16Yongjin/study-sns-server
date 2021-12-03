import { IsPositive } from 'class-validator'

export class UpdateStudyTimeDto {
  @IsPositive()
  duration: number
}
