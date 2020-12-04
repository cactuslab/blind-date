import { toLocalDateString, toLocalTimeString } from '..'
import dayjs from 'dayjs'

test('toLocalDateString', () => {
	expect(toLocalDateString(dayjs('2020-01-01'))).toEqual('2020-01-01')
	expect(toLocalDateString(dayjs('2020-12-31'))).toEqual('2020-12-31')
	expect(toLocalDateString(dayjs('1970-01-01'))).toEqual('1970-01-01')
	expect(toLocalDateString(dayjs('1969-12-31'))).toEqual('1969-12-31')

	expect(toLocalDateString(dayjs('2020-12-05T13:37'))).toEqual('2020-12-05')
	expect(toLocalDateString(dayjs('2020-12-05T01:37'))).toEqual('2020-12-05')
})

test('toLocalTimeString', () => {
	expect(toLocalTimeString(dayjs('2020-12-05T12:01'))).toEqual('12:01:00')
	expect(toLocalTimeString(dayjs('1969-12-31T17:59'))).toEqual('17:59:00')
})
