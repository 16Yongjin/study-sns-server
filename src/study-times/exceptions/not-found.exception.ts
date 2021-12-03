import { NotFoundException } from '@nestjs/common'
import { PK } from '../../shared/types'

export class StudyTimeNotFound extends NotFoundException {
  constructor(timeId: PK) {
    super({
      message: `StudyTime ${timeId} Not Found`,
      errors: { timeId: 'not found' },
    })
  }
}
