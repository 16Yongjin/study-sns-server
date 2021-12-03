import { StudyTime } from '../../study-times/entities/study-time.entity'
import { User } from '../../users/entities/user.entity'
import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm'

@Entity()
export class StudyGoal extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number

  @Column()
  name!: string

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @DeleteDateColumn()
  deletedAt?: Date

  @ManyToOne(() => User, (user) => user.studyGoals, { onDelete: 'CASCADE' })
  user: User

  @OneToMany(() => StudyTime, (time) => time.studyGoal)
  studyTimes: StudyTime[]
}
