import { IsEmpty, IsNotEmpty } from 'class-validator'
import { PK } from '../../shared/types'

export class CreateStudyTimeDto {
  @IsEmpty()
  readonly userId: PK

  @IsNotEmpty()
  readonly studyGoalId: PK
}
