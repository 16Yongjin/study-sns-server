import { Role } from '../enums'
import { PK } from '../types'

export interface UserAuth {
  id: PK
  username: string
  email: string
  role: Role
  exp: number
}
