import { Injectable } from '@nestjs/common'
import { CreateStudyStatDto } from './dto/create-study-stat.dto'
import { UpdateStudyStatDto } from './dto/update-study-stat.dto'

@Injectable()
export class StudyStatService {
  create(createStudyStatDto: CreateStudyStatDto) {
    return 'This action adds a new studyStat'
  }

  findAll() {
    return `This action returns all studyStat`
  }

  findOne(id: number) {
    return `This action returns a #${id} studyStat`
  }

  update(id: number, updateStudyStatDto: UpdateStudyStatDto) {
    return `This action updates a #${id} studyStat`
  }

  remove(id: number) {
    return `This action removes a #${id} studyStat`
  }
}
