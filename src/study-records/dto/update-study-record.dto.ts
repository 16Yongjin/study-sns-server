import { Length } from 'class-validator'

export class UpdateStudyRecordDto {
  @Length(2)
  content: string
}
