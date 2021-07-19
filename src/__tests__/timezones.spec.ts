import { toLocalDateTimeString, toOffsetDateTimeString } from '..'

test('local date time: timezone offset crosses a year', () => {
	expect(toLocalDateTimeString('2020-01-01T01:02:03+12:00')).toEqual('2020-01-01T01:02:03')
	expect(toLocalDateTimeString('2020-01-01T01:02:03+01:00')).toEqual('2020-01-01T01:02:03')
	expect(toLocalDateTimeString('2020-01-01T01:02:03Z')).toEqual('2020-01-01T01:02:03')
	expect(toLocalDateTimeString('2020-01-01T01:02:03-01:00')).toEqual('2020-01-01T01:02:03')
	expect(toLocalDateTimeString('2020-01-01T01:02:03-02:00')).toEqual('2020-01-01T01:02:03')
	expect(toLocalDateTimeString('2020-01-01T01:02:03-13:00')).toEqual('2020-01-01T01:02:03')
})

test('offset date time: timezone offset crosses a year', () => {
	expect(toOffsetDateTimeString('2020-01-01T01:02:03+12:00')).toEqual('2020-01-01T01:02:03+12:00')
	expect(toOffsetDateTimeString('2020-01-01T01:02:03+01:00')).toEqual('2020-01-01T01:02:03+01:00')
	expect(toOffsetDateTimeString('2020-01-01T01:02:03Z')).toEqual('2020-01-01T01:02:03Z')
	expect(toOffsetDateTimeString('2020-01-01T01:02:03-01:00')).toEqual('2020-01-01T01:02:03-01:00')
	expect(toOffsetDateTimeString('2020-01-01T01:02:03-02:00')).toEqual('2020-01-01T01:02:03-02:00')
	expect(toOffsetDateTimeString('2020-01-01T01:02:03-13:00')).toEqual('2020-01-01T01:02:03-13:00')
})

test('local date time: timezone offset crosses into next day', () => {
	expect(toLocalDateTimeString('2020-02-21T20:00:01+12:00')).toEqual('2020-02-21T20:00:01')
	expect(toLocalDateTimeString('2020-02-21T20:00:01')).toEqual('2020-02-21T20:00:01')
})
