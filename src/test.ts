import _ from 'lodash'
import dayjs from 'dayjs'
;`INSERT INTO public.study_time(
	"createdAt", "updatedAt", "deletedAt", duration, "userId", "studyGoalId", "studyRecordId")
	VALUES ('2021-12-01 23:35:20.1', '2021-12-01 23:35:20.1', null, 10000, 1, 1, null);
`

const studyGoalIds = [1, 2, 6, 7]

const values = (before: number, userId: number, studyGoalId: number) =>
  `('${dayjs().subtract(before, 'day').toISOString()}', '${dayjs()
    .subtract(before, 'day')
    .toISOString()}', null, ${Math.round(
    Math.random() * 10000
  )}, ${userId}, ${studyGoalId}, null)`

const valuesStr = _.range(2, -1, -1)
  .flatMap((d) => studyGoalIds.flatMap((goldId) => values(d, 1, goldId)))
  .join(',\n')

console.log(valuesStr)
