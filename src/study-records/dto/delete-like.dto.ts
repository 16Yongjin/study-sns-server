import { IsNotEmpty } from 'class-validator'
import { PK } from '../../shared/types'

export class DeleteLikeDto {
  @IsNotEmpty()
  userId: PK

  @IsNotEmpty()
  likeId: PK
}
