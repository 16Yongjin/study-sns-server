import { StudyGoal } from '../../study-goals/entities/study-goal.entity'
import { User } from '../../users/entities/user.entity'
import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  DeleteDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm'
import { StudyRecord } from '../../study-records/entities/study-record.entity'

@Entity()
export class StudyTime extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  user: User

  @ManyToOne(() => StudyGoal)
  studyGoal: StudyGoal

  @OneToOne(() => StudyRecord, (record) => record.studyTime, {
    nullable: true,
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  studyRecord?: StudyRecord

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @DeleteDateColumn()
  deletedAt?: Date

  @Column('integer')
  duration = 0
}
