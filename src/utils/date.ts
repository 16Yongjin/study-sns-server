import dayjs from 'dayjs'

export const getToday = () => dayjs().startOf('day').format()
