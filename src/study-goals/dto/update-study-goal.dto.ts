import { IsNotEmpty, Length } from 'class-validator'

export class UpdateStudyGoalDto {
  @IsNotEmpty()
  @Length(1)
  readonly name: string
}
