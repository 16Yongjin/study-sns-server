import { IsEmpty, IsNotEmpty, Length } from 'class-validator'
import { PK } from '../../shared/types'

export class CreateStudyRecordDto {
  @IsEmpty()
  userId: PK // 컨트롤러에서 삽입

  @IsNotEmpty()
  studyTimeId: PK

  @Length(2)
  content: string
}
