import { getRepositoryToken } from '@nestjs/typeorm'
import { User } from '../entities/user.entity'

export const mockUserRepository = (userData: User[]) => {
  return {
    provide: getRepositoryToken(User),
    useValue: {
      find: jest.fn().mockResolvedValue(userData),
      findOne: jest
        .fn()
        .mockImplementation(({ username }) =>
          Promise.resolve(userData.find((u) => u.username === username))
        ),
      delete: jest.fn().mockReturnValue(Promise.resolve()),
      save: jest.fn().mockImplementation((user) => {
        user.id = userData.length
        userData.push(user)
        return user
      }),
    },
  }
}
