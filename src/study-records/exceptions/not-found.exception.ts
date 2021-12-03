import { NotFoundException } from '@nestjs/common'
import { PK } from '../../shared/types'

export class StudyRecordNotFound extends NotFoundException {
  constructor(id: PK) {
    super({
      message: `StudyRecord ${id} not found`,
      errors: { studyRecordId: 'not found' },
    })
  }
}

export class CommentNotFound extends NotFoundException {
  constructor(id: PK) {
    super({
      message: `Comment ${id} not found`,
      errors: { commentId: 'not found' },
    })
  }
}

export class LikeNotFound extends NotFoundException {
  constructor(id: PK) {
    super({
      message: `Like ${id} not found`,
      errors: { likeId: 'not found' },
    })
  }
}
