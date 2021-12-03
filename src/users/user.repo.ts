import { AbstractRepository, EntityRepository } from 'typeorm'
import { CreateUserDto } from './dto'
import { PK } from '../shared/types'
import { User } from './entities/user.entity'

@EntityRepository(User)
export class UserRepository extends AbstractRepository<User> {
  create(dto: CreateUserDto) {
    const newUser = new User()
    newUser.username = dto.username
    newUser.email = dto.email
    newUser.fullname = dto.fullname
    newUser.password = dto.password

    return this.repository.save(newUser)
  }

  findAll(): Promise<User[]> {
    return this.repository.find()
  }

  save(user: User) {
    return this.repository.save(user)
  }

  findOne(id: PK, relations: string[] = []): Promise<User> {
    return this.repository.findOne({
      where: { id },
      relations,
    })
  }

  /**
   * 비밀번호를 포함하는 유저 쿼리
   */
  findOneByUsername(username: string): Promise<User> {
    return this.repository
      .createQueryBuilder('user')
      .where('user.username = :username', { username })
      .addSelect('user.password')
      .getOne()
  }

  checkUser(username: string, email: string): Promise<User> {
    return this.repository.findOne({
      where: [{ username }, { email }],
    })
  }
}
