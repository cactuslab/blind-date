import { toLocalDateString, toLocalDateTimeString, toLocalTimeString, toOffsetDateTimeString } from '..'
import { currentTimezone, offsetInJanuary, offsetInJanuary1970, offsetInJuly, Timezone } from './tz'

test('toLocalDateString from local date literal', () => {
	expect(toLocalDateString({ year: 2020, month: 1, day: 1 })).toEqual('2020-01-01')
	expect(toLocalDateString({ year: 2020, month: 12, day: 31 })).toEqual('2020-12-31')
	expect(toLocalDateString({ year: 1970, month: 1, day: 1 })).toEqual('1970-01-01')
	expect(toLocalDateString({ year: 1969, month: 12, day: 31 })).toEqual('1969-12-31')
	expect(toLocalDateString({ year: 1969, month: 12 })).toEqual('1969-12-01')
})

test('toLocalDateTimeString from local date time literal', () => {
	expect(toLocalDateTimeString({ year: 2020, month: 1, day: 1, hours: 1, minutes: 23 })).toEqual('2020-01-01T01:23:00')
	expect(toLocalDateTimeString({ year: 2020, month: 1, day: 1, hours: 1, minutes: 23, seconds: 45 })).toEqual('2020-01-01T01:23:45')
	expect(toLocalDateTimeString({ year: 2020, month: 12, day: 31, hours: 1, minutes: 23, seconds: 45 })).toEqual('2020-12-31T01:23:45')
	expect(toLocalDateTimeString({ year: 1970, month: 1, day: 1, hours: 1, minutes: 23, seconds: 45 })).toEqual('1970-01-01T01:23:45')
	expect(toLocalDateTimeString({ year: 1969, month: 12, day: 31, hours: 1, minutes: 23, seconds: 45 })).toEqual('1969-12-31T01:23:45')
	expect(toLocalDateTimeString({ year: 1969, month: 12, day: 31, hours: 1, minutes: 23, seconds: 45, milliseconds: 234 })).toEqual('1969-12-31T01:23:45.234')
})

test('toLocalTimeString from local time literal', () => {
	expect(toLocalTimeString(12, 1)).toEqual('12:01:00')
	expect(toLocalTimeString(12, 1, 0)).toEqual('12:01:00')
	expect(toLocalTimeString(12, 1, 1)).toEqual('12:01:01')
	expect(toLocalTimeString(12, 1, 0, 0)).toEqual('12:01:00')
	expect(toLocalTimeString(12, 1, 0, 1)).toEqual('12:01:00.001')
	expect(toLocalTimeString(12, 1)).toEqual('12:01:00')
	expect(toLocalTimeString(17, 59)).toEqual('17:59:00')
})

test('toOffsetDateTimeString from offset date time literal', () => {
	expect(toOffsetDateTimeString({ year: 2020, month: 1, day: 1, hours: 0, minutes: 0, seconds: 0, milliseconds: 0, offset: 0 })).toEqual('2020-01-01T00:00:00Z')
	expect(toOffsetDateTimeString({ year: 1970, month: 1, day: 1, hours: 0, minutes: 0, seconds: 0, milliseconds: 0, offset: 0 })).toEqual('1970-01-01T00:00:00Z')
	expect(toOffsetDateTimeString({ year: 1969, month: 12, day: 31, hours: 0, minutes: 0, seconds: 0, milliseconds: 0, offset: 0 })).toEqual('1969-12-31T00:00:00Z')
	expect(toOffsetDateTimeString({ year: 2020, month: 1, day: 1, hours: 0, minutes: 0, seconds: 0, milliseconds: 0, offset: 720 })).toEqual('2020-01-01T00:00:00+12:00')
	expect(toOffsetDateTimeString({ year: 2020, month: 1, day: 1, hours: 0, minutes: 0, seconds: 0, milliseconds: 0, offset: -360 })).toEqual('2020-01-01T00:00:00-06:00')
	expect(toOffsetDateTimeString({ year: 1969, month: 12, day: 31, hours: 0, minutes: 0, seconds: 0, milliseconds: 0, offset: 780 })).toEqual('1969-12-31T00:00:00+13:00')
})

test('toOffsetDateTimeString from local date literal', () => {
	const tz = currentTimezone()
	expect(toOffsetDateTimeString({ year: 2020, month: 1, day: 1 })).toEqual(`2020-01-01T00:00:00${offsetInJanuary(tz)}`)
})

test('toOffsetDateTimeString from local date time literal', () => {
	const tz = currentTimezone()
	expect(toOffsetDateTimeString({ year: 2020, month: 1, day: 1, hours: 22, minutes: 1 })).toEqual(`2020-01-01T22:01:00${offsetInJanuary(tz)}`)
})

test('toLocalDateString from offset date time literal', () => {
	expect(toLocalDateString({ year: 2020, month: 1, day: 1, hours: 1, minutes: 1, offset: -480 })).toEqual('2020-01-01')
	expect(toLocalDateString({ year: 2020, month: 1, day: 1, hours: 1, minutes: 1, offset: 780 })).toEqual('2020-01-01')
})

test('toLocalDateString from local time literal', () => {
	expect(toLocalDateString({ hours: 1, minutes: 1 })).toEqual('1970-01-01')
})

test('toLocalDateTimeString from local time literal', () => {
	expect(toLocalDateTimeString({ hours: 1, minutes: 1 })).toEqual('1970-01-01T01:01:00')
})

test('toOffsetDateTimeString from local time literal', () => {
	const tz = currentTimezone()
	expect(toOffsetDateTimeString({ hours: 1, minutes: 1 })).toEqual(`1970-01-01T01:01:00${offsetInJanuary1970(tz)}`)
})

test('toOffsetDateTimeString from literal around NZ daylight savings', () => {
	const tz = currentTimezone()
	if (tz !== Timezone.PacificAuckland) {
		return
	}

	/* This is just before daylight savings time starts in NZ */
	expect(toOffsetDateTimeString(2021, 9, 26, 1, 59, 59, 0)).toEqual(`2021-09-26T01:59:59${offsetInJuly(tz)}`)
	/* This is just after daylight savings time starts in NZ, so there is no 2AM */
	expect(toOffsetDateTimeString(2021, 9, 26, 2, 0, 0)).toEqual(`2021-09-26T03:00:00${offsetInJanuary(tz)}`)
	expect(toOffsetDateTimeString(2021, 9, 26, 2, 59)).toEqual(`2021-09-26T03:59:00${offsetInJanuary(tz)}`)
	expect(toOffsetDateTimeString(2021, 9, 26, 3, 0, 0, 0)).toEqual(`2021-09-26T03:00:00${offsetInJanuary(tz)}`)
	expect(toOffsetDateTimeString(2021, 9, 26, 3, 59)).toEqual(`2021-09-26T03:59:00${offsetInJanuary(tz)}`)
	expect(toOffsetDateTimeString(2021, 9, 26, 4, 0, 0, 0)).toEqual(`2021-09-26T04:00:00${offsetInJanuary(tz)}`)
})

test('toOffsetDateTimeString from literal around LA daylight savings', () => {
	const tz = currentTimezone()
	if (tz !== Timezone.AmericaLosAngeles) {
		return
	}

	/* This is just before daylight savings time starts in LA */
	expect(toOffsetDateTimeString(2021, 3, 14, 1, 59, 59, 0)).toEqual(`2021-03-14T01:59:59${offsetInJanuary(tz)}`)
	/* This is just after daylight savings time starts in LA, so there is no 2AM */
	expect(toOffsetDateTimeString(2021, 3, 14, 2, 0, 0)).toEqual(`2021-03-14T03:00:00${offsetInJuly(tz)}`)
	expect(toOffsetDateTimeString(2021, 3, 14, 2, 59, 0, 0)).toEqual(`2021-03-14T03:59:00${offsetInJuly(tz)}`)
	expect(toOffsetDateTimeString(2021, 3, 14, 3, 0, 0, 0)).toEqual(`2021-03-14T03:00:00${offsetInJuly(tz)}`)
	expect(toOffsetDateTimeString(2021, 3, 14, 3, 59)).toEqual(`2021-03-14T03:59:00${offsetInJuly(tz)}`)
	expect(toOffsetDateTimeString(2021, 3, 14, 4, 0)).toEqual(`2021-03-14T04:00:00${offsetInJuly(tz)}`)
})

test('toOffsetDateTimeString from literal with explicit offset around NZ daylight savings', () => {
	/* This is just before daylight savings time starts in NZ */
	expect(toOffsetDateTimeString(2021, 9, 26, 1, 59, 59, 0, 720)).toEqual('2021-09-26T01:59:59+12:00')
	/* This is just after daylight savings time starts in NZ, so there is no 2AM, but we're forcing the offset, so there is! */
	expect(toOffsetDateTimeString(2021, 9, 26, 2, 0, 0, 0, 720)).toEqual('2021-09-26T02:00:00+12:00')
	expect(toOffsetDateTimeString(2021, 9, 26, 2, 59, 0, 0, 720)).toEqual('2021-09-26T02:59:00+12:00')
	expect(toOffsetDateTimeString(2021, 9, 26, 3, 0, 0, 0, 720)).toEqual('2021-09-26T03:00:00+12:00')
	expect(toOffsetDateTimeString(2021, 9, 26, 3, 59, 0, 0, 720)).toEqual('2021-09-26T03:59:00+12:00')
	expect(toOffsetDateTimeString(2021, 9, 26, 4, 0, 0, 0, 720)).toEqual('2021-09-26T04:00:00+12:00')
})
