import { BadRequestException } from '@nestjs/common'

export class AlreadyLikedException extends BadRequestException {
  constructor() {
    super({
      message: `이미 좋아요 표시했습니다.`,
    })
  }
}
