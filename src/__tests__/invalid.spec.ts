import { DateTime } from 'luxon'
import moment from 'moment'
import { isValid, toLocalDateString, toLocalTimeString, toOffsetDateTimeString } from '..'
import { currentTimezone, offsetInJanuary } from './tz'

test('isValid is false for bad strings', () => {
	expect(isValid('X')).toBe(false)
	expect(isValid('-')).toBe(false)
	expect(isValid('07/2021')).toBe(false)
})

test('isValid is false for invalid DateTime', () => {
	expect(isValid(DateTime.invalid('unknown'))).toBe(false)
})

test('isValid is false for invalid Moment', () => {
	expect(isValid(moment.invalid())).toBe(false)
})

test('isValid is false for date-looking strings that new Date would parse', () => {
	expect(isValid('2 August 1998')).toBe(false)
})

test('isValid is false for partial ISO date strings', () => {
	expect(isValid('2020')).toBe(false)
	expect(isValid('2020-01')).toBe(false)
})

test('toLocalDateString with out of bound input', () => {
	expect(toLocalDateString(2020, 0, 1)).toEqual('2019-12-01')
})

test('toLocalTimeString with out of bound input', () => {
	expect(toLocalTimeString(11, 1, 2)).toEqual('11:01:02')
	expect(toLocalTimeString(11, -1, 2)).toEqual('10:59:02')
})

test('toOffsetDateTimeString with out of bound input', () => {
	const tz = currentTimezone()
	expect(toOffsetDateTimeString(2020, 1, 1, -1, 2, 3)).toEqual(`2019-12-31T23:02:03${offsetInJanuary(tz)}`)
})
