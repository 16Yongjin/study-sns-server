import { IsNotEmpty, Length } from 'class-validator'

export class ChangePasswordDto {
  @IsNotEmpty()
  username: string

  @IsNotEmpty()
  @Length(6)
  password: string
}
