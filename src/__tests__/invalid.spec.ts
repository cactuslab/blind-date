import { DateTime } from 'luxon'
import moment from 'moment'
import { isValid } from '..'

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
