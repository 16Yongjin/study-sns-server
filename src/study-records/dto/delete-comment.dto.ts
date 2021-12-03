import { IsNotEmpty } from 'class-validator'
import { PK } from '../../shared/types'

export class DeleteCommentDto {
  @IsNotEmpty()
  userId: PK

  @IsNotEmpty()
  commentId: PK
}
