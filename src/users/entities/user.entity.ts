import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Column,
  BeforeInsert,
  OneToMany,
} from 'typeorm'
import * as argon2 from 'argon2'
import { Role } from '../../shared/enums'
import { StudyTime } from '../../study-times/entities/study-time.entity'
import { StudyGoal } from '../../study-goals/entities/study-goal.entity'
import { StudyRecord } from '../../study-records/entities/study-record.entity'

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.USER,
  })
  role!: Role

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @Column({ unique: true })
  username!: string

  @Column()
  fullname!: string

  @Column({ unique: true })
  email!: string

  @Column({ select: false })
  password!: string

  @OneToMany(() => StudyTime, (time) => time.user)
  studyTimes: StudyTime[]

  @OneToMany(() => StudyGoal, (goal) => goal.user)
  studyGoals: StudyGoal[]

  @OneToMany(() => StudyRecord, (record) => record.user)
  studyRecords: StudyRecord[]

  @BeforeInsert()
  async hashPassword() {
    this.password = await argon2.hash(this.password)
  }

  async changePassword(password: string) {
    this.password = password
    await this.hashPassword()
  }

  toJSON() {
    delete this.password
    return this
  }
}
