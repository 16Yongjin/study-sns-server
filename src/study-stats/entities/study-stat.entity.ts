import { User } from '../../users/entities/user.entity'
import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm'

@Entity()
export class StudyStat extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number

  @Column()
  name!: string

  @CreateDateColumn()
  createdAt: Date

  @ManyToOne(() => User)
  user: User

  @Column()
  dailyDuration!: number

  @Column()
  weeklyDuration!: number

  @Column()
  monthlyDuration!: number
}
