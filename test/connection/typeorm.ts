import { TypeOrmModuleOptions } from '@nestjs/typeorm'
import { Connection } from 'typeorm'

export const testConnection: TypeOrmModuleOptions = {
  // type: 'sqlite',
  // database: ':memory:',
  // dropSchema: true,
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: 5432,
  username: process.env.POSTGRES_PASSWORD,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_TEST_DATABASE,
  entities: ['./**/*.entity.ts'],
  synchronize: true,
}

export async function fixedSync(connection: Connection) {
  await connection.query('PRAGMA foreign_keys=OFF')
  await connection.synchronize()
  await connection.query('PRAGMA foreign_keys=ON')
}

export const cleanFixtures = async (connection: Connection) => {
  const entities = connection.entityMetadatas
  try {
    for (const entity of entities) {
      const repository = connection.getRepository(entity.name)
      await repository.delete({})
    }
  } catch (error) {
    throw new Error(`ERROR: Cleaning test db: ${error}`)
  }
}
