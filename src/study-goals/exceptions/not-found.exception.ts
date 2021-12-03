import { NotFoundException } from '@nestjs/common'
import { PK } from '../../shared/types'

export class StudyGoalNotFound extends NotFoundException {
  constructor(id: PK) {
    super({
      message: `Goal ${id} Not Found`,
      errors: { studyGoalId: 'not exists' },
    })
  }
}
