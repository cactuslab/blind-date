import { toLocalDateString, toLocalDateTimeString, toLocalTimeString } from '..'
import moment from 'moment'

test('toLocalDateString', () => {
	expect(toLocalDateString(moment('2020-01-01'))).toEqual('2020-01-01')
	expect(toLocalDateString(moment('2020-12-31'))).toEqual('2020-12-31')
	expect(toLocalDateString(moment('1970-01-01'))).toEqual('1970-01-01')
	expect(toLocalDateString(moment('1969-12-31'))).toEqual('1969-12-31')

	expect(toLocalDateString(moment('2020-12-05T13:37'))).toEqual('2020-12-05')
	expect(toLocalDateString(moment('2020-12-05T01:37'))).toEqual('2020-12-05')
})

test('toLocalTimeString', () => {
	expect(toLocalTimeString(moment('2020-12-05T12:01'))).toEqual('12:01:00')
	expect(toLocalTimeString(moment('1969-12-31T17:59'))).toEqual('17:59:00')
})

/* Note that moment can parse timezones but doesn't preserve them after parsing; it instead
   converts to the local time zone.
 */
test('toLocalTimeString with time zone', () => {
	expect(toLocalTimeString(moment('1969-12-31T17:59+12:00').utcOffset(720))).toEqual('17:59:00')
	expect(toLocalTimeString(moment('1969-12-31T17:59-08:00').utcOffset(-480))).toEqual('17:59:00')
	expect(toLocalTimeString(moment('1969-12-31T17:59+13:00').utcOffset(780))).toEqual('17:59:00')
	expect(toLocalTimeString(moment('1969-12-31T17:59Z').utcOffset(0))).toEqual('17:59:00')
})

test('use a LocalDateTimeString', () => {
	const v = toLocalDateTimeString('2020-12-05T10:18')
	const w = toLocalDateTimeString(moment(v).add(1, 'day'))
	expect(w).toEqual('2020-12-06T10:18:00')
})
