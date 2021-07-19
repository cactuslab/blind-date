import { toLocalDateString, toLocalDateTimeString, toLocalTimeString, toOffsetDateTimeString } from '..'

test('toLocalDateString from numbers', () => {
	expect(toLocalDateString(2020, 1, 1)).toEqual('2020-01-01')
	expect(toLocalDateString(2020, 12, 31)).toEqual('2020-12-31')
	expect(toLocalDateString(1970, 1, 1)).toEqual('1970-01-01')
	expect(toLocalDateString(1969, 12, 31)).toEqual('1969-12-31')
})

test('toLocalDateTimeString from string', () => {
	expect(toLocalDateTimeString(2020, 1, 1, 1, 23, 45)).toEqual('2020-01-01T01:23:45')
	expect(toLocalDateTimeString(2020, 12, 31, 1, 23, 45)).toEqual('2020-12-31T01:23:45')
	expect(toLocalDateTimeString(1970, 1, 1, 1, 23, 45)).toEqual('1970-01-01T01:23:45')
	expect(toLocalDateTimeString(1969, 12, 31, 1, 23, 45)).toEqual('1969-12-31T01:23:45')
})

test('toLocalTimeString from string', () => {
	expect(toLocalTimeString(12, 1)).toEqual('12:01:00')
	expect(toLocalTimeString(12, 1, 0)).toEqual('12:01:00')
	expect(toLocalTimeString(12, 1, 1)).toEqual('12:01:01')
	expect(toLocalTimeString(12, 1, 0, 0)).toEqual('12:01:00')
	expect(toLocalTimeString(12, 1, 0, 1)).toEqual('12:01:00.001')
	expect(toLocalTimeString(12, 1)).toEqual('12:01:00')
	expect(toLocalTimeString(17, 59)).toEqual('17:59:00')
})

test('toOffsetDateTimeString from string', () => {
	expect(toOffsetDateTimeString(2020, 1, 1, 0, 0, 0, 0, 0)).toEqual('2020-01-01T00:00:00Z')
	expect(toOffsetDateTimeString(1970, 1, 1, 0, 0, 0, 0, 0)).toEqual('1970-01-01T00:00:00Z')
	expect(toOffsetDateTimeString(1969, 12, 31, 0, 0, 0, 0, 0)).toEqual('1969-12-31T00:00:00Z')
	expect(toOffsetDateTimeString(2020, 1, 1, 0, 0, 0, 0, 720)).toEqual('2020-01-01T00:00:00+12:00')
	expect(toOffsetDateTimeString(2020, 1, 1, 0, 0, 0, 0, -360)).toEqual('2020-01-01T00:00:00-06:00')
	expect(toOffsetDateTimeString(1969, 12, 31, 0, 0, 0, 0, 780)).toEqual('1969-12-31T00:00:00+13:00')
})
