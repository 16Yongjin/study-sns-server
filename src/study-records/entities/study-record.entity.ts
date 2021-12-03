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
  OneToOne,
  DeleteDateColumn,
  UpdateDateColumn,
} from 'typeorm'
import { Comment } from './comment.entity'
import { Like } from './like.entity'

@Entity()
export class StudyRecord extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number

  @Column()
  content!: string

  @Column({ default: true })
  public: boolean

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @DeleteDateColumn()
  deletedAt: Date

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  user: User

  @OneToOne(() => StudyTime, (time) => time.studyRecord, {
    onDelete: 'CASCADE',
  })
  studyTime: StudyTime

  @OneToMany(() => Comment, (comment) => comment.studyRecord)
  comments: Comment[]

  @OneToMany(() => Like, (like) => like.studyRecord)
  likes: Like[]

  @Column({ default: 0 })
  commentCount: number

  @Column({ default: 0 })
  likeCount: number
}
