import { Role } from '../../shared/enums'

export interface UserData {
  username: string
  fullname: string
  email: string
  token: string
  image?: string
  role: Role
}

export interface UserRO {
  user: UserData
}
