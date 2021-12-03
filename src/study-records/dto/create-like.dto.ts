import { IsNotEmpty } from 'class-validator'
import { PK } from '../../shared/types'

export class CreateLikeDto {
  @IsNotEmpty()
  userId: PK
}
