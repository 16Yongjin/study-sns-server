import { NotFoundException } from '@nestjs/common'
import { PK } from '../../shared/types'

export class UserNotFound extends NotFoundException {
  constructor(id: PK) {
    super({
      message: `User ${id} not found`,
      errors: { id: 'not found' },
    })
  }
}
