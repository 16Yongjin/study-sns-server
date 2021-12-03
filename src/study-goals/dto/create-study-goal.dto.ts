import { IsNotEmpty, Length } from 'class-validator'

export class CreateStudyGoalDto {
  @IsNotEmpty()
  @Length(1)
  readonly name: string
}
