import { toLocalDateString, toLocalDateTimeString, toLocalTimeString, toOffsetDateTimeString } from '..'
import { currentTimezone, Timezone } from './tz'

test('toLocalDateString from millis', () => {
	const tz = currentTimezone()
	expect(toLocalDateString(1611277020000)).toEqual(
		tz === Timezone.PacificAuckland ? '2021-01-22'
			: tz === Timezone.AmericaLosAngeles ? '2021-01-21'
				: 'UNSUPPORTED TIMEZONE')
})

test('toLocalTimeString from millis', () => {
	const tz = currentTimezone()
	expect(toLocalTimeString(1611277020000)).toEqual(
		tz === Timezone.PacificAuckland ? '13:57:00'
			: tz === Timezone.AmericaLosAngeles ? '16:57:00'
				: 'UNSUPPORTED TIMEZONE')
})

test('toLocalDateTimeString from millis', () => {
	const tz = currentTimezone()
	expect(toLocalDateTimeString(1611277020000)).toEqual(
		tz === Timezone.PacificAuckland ? '2021-01-22T13:57:00'
			: tz === Timezone.AmericaLosAngeles ? '2021-01-21T16:57:00'
				: 'UNSUPPORTED TIMEZONE')
})

test('toOffsetDateTimeString from millis', () => {
	const tz = currentTimezone()

	expect(toOffsetDateTimeString(1611277020000)).toEqual(
		tz === Timezone.PacificAuckland ? '2021-01-22T13:57:00+13:00'
			: tz === Timezone.AmericaLosAngeles ? '2021-01-21T16:57:00-08:00'
				: 'UNSUPPORTED TIMEZONE')
})
