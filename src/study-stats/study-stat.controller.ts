import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common'
import { StudyStatService } from './study-stat.service'
import { CreateStudyStatDto } from './dto/create-study-stat.dto'
import { UpdateStudyStatDto } from './dto/update-study-stat.dto'

@Controller('study-stats')
export class StudyStatController {
  constructor(private readonly studyStatService: StudyStatService) {}

  @Post()
  create(@Body() createStudyStatDto: CreateStudyStatDto) {
    return this.studyStatService.create(createStudyStatDto)
  }

  @Get()
  findAll() {
    return this.studyStatService.findAll()
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.studyStatService.findOne(+id)
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateStudyStatDto: UpdateStudyStatDto
  ) {
    return this.studyStatService.update(+id, updateStudyStatDto)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.studyStatService.remove(+id)
  }
}
