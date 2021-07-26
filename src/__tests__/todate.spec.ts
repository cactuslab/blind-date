import { toDate, toLocalDateString, toLocalDateTimeString, toLocalTimeString } from '..'

test('toLocalDateString toDate round trips', () => {
	expect(toLocalDateString(toDate(toLocalDateString('2020-01-01')))).toEqual('2020-01-01')
})

test('toLocalDateTimeString toDate round trips', () => {
	expect(toLocalDateTimeString(toDate(toLocalDateTimeString('2020-01-01T01:01:01')))).toEqual('2020-01-01T01:01:01')
})

test('toLocalTimeString toDate round trips', () => {
	expect(toLocalTimeString(toDate(toLocalTimeString('01:01:01')))).toEqual('01:01:01')
})
