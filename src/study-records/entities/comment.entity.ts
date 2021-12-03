import { User } from '../../users/entities/user.entity'
import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  DeleteDateColumn,
} from 'typeorm'
import { StudyRecord } from './study-record.entity'

@Entity()
export class Comment extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number

  @Column()
  content!: string

  @CreateDateColumn()
  createdAt: Date

  @DeleteDateColumn()
  deletedAt: Date

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  user: User

  @ManyToOne(() => StudyRecord, { onDelete: 'CASCADE' })
  studyRecord: StudyRecord
}
