import { toLocalDateString, toLocalTimeString, toOffsetDateTimeString, toLocalDateTimeString, LocalDateTimeString, LocalDateString, LocalTimeString, OffsetDateTimeString } from '..'
import moment from 'moment'

test('examples', () => {
	const exampleMoment: moment.Moment = moment('22/1/2021 13:57', 'DD/MM/YYYY HH:mm')

	const localDate: LocalDateString = toLocalDateString(exampleMoment)
	expect(localDate).toEqual('2021-01-22')

	const localDateTime: LocalDateTimeString = toLocalDateTimeString(exampleMoment)
	expect(localDateTime).toEqual('2021-01-22T13:57:00')

	const localTime: LocalTimeString = toLocalTimeString(exampleMoment)
	expect(localTime).toEqual('13:57:00')

	const offsetDateTime: OffsetDateTimeString = toOffsetDateTimeString(exampleMoment)
	// something like '2021-01-22T13:57:00+13:00'
	expect(typeof offsetDateTime).toEqual('string')

	const offsetDateTime2: OffsetDateTimeString = toOffsetDateTimeString('2021-01-22T13:57:00-08:00')
	expect(offsetDateTime2).toEqual('2021-01-22T13:57:00-08:00')
})
