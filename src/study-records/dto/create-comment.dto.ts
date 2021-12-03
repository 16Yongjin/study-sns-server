import { IsEmpty, Length } from 'class-validator'
import { PK } from '../../shared/types'

export class CreateCommentDto {
  @IsEmpty()
  userId: PK

  @Length(2)
  content: string
}
