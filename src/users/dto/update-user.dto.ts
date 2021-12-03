import { IsEmpty, IsNotEmpty } from 'class-validator'
import { Role } from '../../shared/enums'

export class UpdateUserDto {
  @IsNotEmpty()
  readonly fullname: string

  @IsEmpty()
  readonly role?: Role
}
