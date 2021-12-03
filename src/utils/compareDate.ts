import dayjs from 'dayjs'

export const formatDate = (d: Date) => dayjs(d).format('YYYY-MM-DDTHH:mm')

export const compareDate = (d1: Date, d2: Date) =>
  formatDate(d1) === formatDate(d2)
