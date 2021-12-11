import { Min } from 'class-validator'

export class UpdateStudyTimeDto {
  @Min(0)
  duration: number
}
