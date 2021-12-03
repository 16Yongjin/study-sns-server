import { PartialType } from '@nestjs/mapped-types';
import { CreateStudyStatDto } from './create-study-stat.dto';

export class UpdateStudyStatDto extends PartialType(CreateStudyStatDto) {}
