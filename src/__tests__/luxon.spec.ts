import { toLocalDateString, toLocalTimeString } from '..'
import { DateTime } from 'luxon'

test('toLocalDateString', () => {
	expect(toLocalDateString(DateTime.fromISO('2020-01-01'))).toEqual('2020-01-01')
	expect(toLocalDateString(DateTime.fromISO('2020-12-31'))).toEqual('2020-12-31')
	expect(toLocalDateString(DateTime.fromISO('1970-01-01'))).toEqual('1970-01-01')
	expect(toLocalDateString(DateTime.fromISO('1969-12-31'))).toEqual('1969-12-31')

	expect(toLocalDateString(DateTime.fromISO('2020-12-05T13:37'))).toEqual('2020-12-05')
	expect(toLocalDateString(DateTime.fromISO('2020-12-05T01:37'))).toEqual('2020-12-05')
})

test('toLocalTimeString', () => {
	expect(toLocalTimeString(DateTime.fromISO('2020-12-05T12:01'))).toEqual('12:01:00')
	expect(toLocalTimeString(DateTime.fromISO('1969-12-31T17:59'))).toEqual('17:59:00')
})

/* Note that with the setZone: true option, Luxon retains the timezone from the parsed string. */
test('toLocalTimeString with time zone', () => {
	expect(toLocalTimeString(DateTime.fromISO('1969-12-31T17:59+12:00', { setZone: true }))).toEqual('17:59:00')
	expect(toLocalTimeString(DateTime.fromISO('1969-12-31T17:59-08:00', { setZone: true }))).toEqual('17:59:00')
	expect(toLocalTimeString(DateTime.fromISO('1969-12-31T17:59+13:00', { setZone: true }))).toEqual('17:59:00')
	expect(toLocalTimeString(DateTime.fromISO('1969-12-31T17:59Z', { setZone: true }))).toEqual('17:59:00')
})
