import { IsNotEmpty, Length } from 'class-validator'

export class ChangePasswordDto {
  @IsNotEmpty()
  @Length(6)
  password: string
}
