import { User } from '../../users/entities/user.entity'
import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm'
import { StudyRecord } from './study-record.entity'

@Entity()
export class Like extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number

  @CreateDateColumn()
  createdAt: Date

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  user: User

  @ManyToOne(() => StudyRecord, { onDelete: 'CASCADE' })
  studyRecord: StudyRecord
}
