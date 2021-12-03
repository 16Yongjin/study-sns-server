import * as request from 'supertest'
import { INestApplication } from '@nestjs/common'
import { StatusCodes } from 'http-status-codes'
import { PK } from '../../src/shared/types'
import { expectStatus, requestOpitons } from './status'

export class UserAgent {
  authToken = ''

  constructor(private app: INestApplication) {}

  // =============== 인증 =====================

  async login(
    data: { username: string; password: string },
    options = requestOpitons
  ) {
    const response = await this.post({
      url: '/auth/login',
      data,
      options,
    })

    if (response.status === StatusCodes.CREATED) {
      this.authToken = response.body.token
    }

    return response
  }

  async signup(
    data: {
      username: string
      password: string
      fullname: string
      email: string
    },
    options = requestOpitons
  ) {
    const response = await this.post({
      url: '/auth/signup',
      data,
      options,
    })

    if (response.status === StatusCodes.CREATED) {
      this.authToken = response.body.token
    }

    return response
  }

  async me(options = requestOpitons) {
    return this.get({ url: '/auth/me', options })
  }

  changePassword(data: { password: string }, options = requestOpitons) {
    return this.post({
      url: '/auth/change-password',
      data,
      options,
    })
  }

  // =============== 사용자 ======================

  getUsers(options = requestOpitons) {
    return this.get({ url: '/users', options })
  }

  updateUser(
    userId: PK,
    data: {
      fullname: string
    },
    options = requestOpitons
  ) {
    return this.post({
      url: `/users/${userId}`,
      data,
      options,
    })
  }

  // =============== 공부 목표 =====================

  createStudyGoal(data: { name: string }, options = requestOpitons) {
    return this.post({
      url: '/study-goals',
      data,
      options,
    })
  }

  getStudyGoals(options = requestOpitons) {
    return this.get({ url: '/study-goals', options })
  }

  updateStudyGoal(
    studyGoalId: PK,
    data: { name: string },
    options = requestOpitons
  ) {
    return this.patch({
      url: `/study-goals/${studyGoalId}`,
      data,
      options,
    })
  }

  deleteStudyGoal(studyGoalId: PK, options = requestOpitons) {
    return this.delete({
      url: `/study-goals/${studyGoalId}`,
      options,
    })
  }

  // =============== 공부 시간 =====================

  createStudyTime(data: { studyGoalId: PK }, options = requestOpitons) {
    return this.post({
      url: '/study-times',
      data,
      options,
    })
  }

  getStudyTimes(options = requestOpitons) {
    return this.get({ url: '/study-times', options })
  }

  getTodayStudyTimes(options = requestOpitons) {
    return this.get({ url: '/study-times/today', options })
  }

  updateStudyTime(
    studyTimeId: PK,
    data: { duration: number },
    options = requestOpitons
  ) {
    return this.patch({
      url: `/study-times/${studyTimeId}`,
      data,
      options,
    })
  }

  deleteStudyTime(studyGoalId: PK, options = requestOpitons) {
    return this.delete({
      url: `/study-times/${studyGoalId}`,
      options,
    })
  }

  // =============== 공부 내용 =====================

  createStudyRecord(
    data: { studyTimeId: PK; content: string },
    options = requestOpitons
  ) {
    return this.post({
      url: '/study-records',
      data,
      options,
    })
  }

  getStudyRecords(options = requestOpitons) {
    return this.get({ url: '/study-records', options })
  }

  getStudyRecord(id: PK, options = requestOpitons) {
    return this.get({ url: `/study-records/${id}`, options })
  }

  updateStudyRecord(
    studyRecordId: PK,
    data: { content: string },
    options = requestOpitons
  ) {
    return this.patch({
      url: `/study-records/${studyRecordId}`,
      data,
      options,
    })
  }

  deleteStudyRecord(studyGoalId: PK, options = requestOpitons) {
    return this.delete({
      url: `/study-records/${studyGoalId}`,
      options,
    })
  }

  // =============== 댓 글 =====================

  createComment(
    studyRecordId: PK,
    data: { content: string },
    options = requestOpitons
  ) {
    return this.post({
      url: `/study-records/${studyRecordId}/comments`,
      data,
      options,
    })
  }

  getComments(studyRecordId: PK, options = requestOpitons) {
    return this.get({
      url: `/study-records/${studyRecordId}/comments`,
      options,
    })
  }

  deleteComment(studyRecordId: PK, commentId: PK, options = requestOpitons) {
    return this.delete({
      url: `/study-records/${studyRecordId}/comments/${commentId}`,
      options,
    })
  }

  // =============== 좋아요 =====================

  createLike(studyRecordId: PK, options = requestOpitons) {
    return this.post({
      url: `/study-records/${studyRecordId}/likes`,
      data: {},
      options,
    })
  }

  deleteLike(studyRecordId: PK, options = requestOpitons) {
    return this.delete({
      url: `/study-records/${studyRecordId}/likes`,
      options,
    })
  }

  // =============== 유틸 =====================

  get({
    url,
    options = requestOpitons,
  }: {
    url: string
    options: typeof requestOpitons
  }) {
    return request
      .agent(this.app.getHttpServer())
      .get(url)
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${this.authToken}`)
      .expect('Content-Type', /json/)
      .expect(expectStatus(options))
  }

  post({
    url,
    data,
    options = requestOpitons,
  }: {
    url: string
    data: Record<string, any>
    options: typeof requestOpitons
  }) {
    return request
      .agent(this.app.getHttpServer())
      .post(url)
      .send(data)
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${this.authToken}`)
      .expect('Content-Type', /json/)
      .expect(expectStatus(options, StatusCodes.CREATED))
  }

  patch({
    url,
    data,
    options = requestOpitons,
  }: {
    url: string
    data: Record<string, any>
    options: typeof requestOpitons
  }) {
    return request
      .agent(this.app.getHttpServer())
      .patch(url)
      .send(data)
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${this.authToken}`)
      .expect('Content-Type', /json/)
      .expect(expectStatus(options))
  }

  delete({
    url,
    options = requestOpitons,
  }: {
    url: string
    options: typeof requestOpitons
  }) {
    return request
      .agent(this.app.getHttpServer())
      .delete(url)
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${this.authToken}`)
      .expect(expectStatus(options))
  }
}
