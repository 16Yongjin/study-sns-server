import { User } from '../entities/user.entity'

export const mockUserData = () =>
  [
    {
      id: 1,
      username: 'tester1',
      fullname: 'jone doe',
      email: 'test1@test.com',
      createdAt: new Date(),
      updatedAt: new Date(),
      password: '123456',
    },
    {
      id: 2,
      username: 'tester2',
      fullname: 'jone doeee',
      email: 'test2@test.com',
      createdAt: new Date(),
      updatedAt: new Date(),
      password: '123456',
    },
    {
      id: 3,
      username: 'tester3',
      fullname: 'jane doe',
      email: 'test3@test.com',
      createdAt: new Date(),
      updatedAt: new Date(),
      password: '123456',
    },
  ] as User[]
