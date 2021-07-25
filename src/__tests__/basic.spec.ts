import { isLocalDateString, isLocalTimeString, toLocalDateString, toLocalDateTimeString, toLocalTimeString, toOffsetDateTimeString } from '..'

test('toLocalDateString from string', () => {
	expect(toLocalDateString('2020-01-01')).toEqual('2020-01-01')
	expect(toLocalDateString('2020-12-31')).toEqual('2020-12-31')
	expect(toLocalDateString('1970-01-01')).toEqual('1970-01-01')
	expect(toLocalDateString('1969-12-31')).toEqual('1969-12-31')
})

test('toLocalDateTimeString from string', () => {
	expect(toLocalDateTimeString('2020-01-01T01:23:45')).toEqual('2020-01-01T01:23:45')
	expect(toLocalDateTimeString('2020-12-31T01:23:45')).toEqual('2020-12-31T01:23:45')
	expect(toLocalDateTimeString('1970-01-01T01:23:45')).toEqual('1970-01-01T01:23:45')
	expect(toLocalDateTimeString('1969-12-31T01:23:45')).toEqual('1969-12-31T01:23:45')
})

test('toLocalDateString from date', () => {
	/* We construct the Dates using the (year, month, day) constructor so they are created in
	   the local timezone. If we created them using the ('year-month-day') method, the Date assumes
	   the input is in GMT, which confuses us as we assume all Dates were expressed in local time.
	 */
	expect(toLocalDateString(new Date(2020, 0, 1))).toEqual('2020-01-01')
	expect(toLocalDateString(new Date(2020, 11, 31))).toEqual('2020-12-31')
	expect(toLocalDateString(new Date(1970, 0, 1))).toEqual('1970-01-01')
	expect(toLocalDateString(new Date(1969, 11, 31))).toEqual('1969-12-31')

	expect(toLocalDateString(new Date('2020-12-05T13:37'))).toEqual('2020-12-05')
	expect(toLocalDateString(new Date('2020-12-05T01:37'))).toEqual('2020-12-05')
	expect(toLocalDateString(new Date('2020-12-05T23:37'))).toEqual('2020-12-05')
	expect(toLocalDateString(new Date('2020-12-05T00:00'))).toEqual('2020-12-05')
})

test('toOffsetDateTimeString from string', () => {
	expect(toOffsetDateTimeString('2020-01-01T00:00:00.000Z')).toEqual('2020-01-01T00:00:00Z')
	expect(toOffsetDateTimeString('1970-01-01T00:00:00.000Z')).toEqual('1970-01-01T00:00:00Z')
	expect(toOffsetDateTimeString('1969-12-31T00:00:00.000Z')).toEqual('1969-12-31T00:00:00Z')
})

test('toOffsetDateTimeString respects milliseconds', () => {
	expect(toOffsetDateTimeString('2020-01-01T00:00:00.001Z')).toEqual('2020-01-01T00:00:00.001Z')
})

test('toOffsetDateTimeString preserves time zones', () => {
	expect(toOffsetDateTimeString('2020-01-01T00:00:00+12:00')).toEqual('2020-01-01T00:00:00+12:00')
	expect(toOffsetDateTimeString('2020-01-01T00:00:00-06:00')).toEqual('2020-01-01T00:00:00-06:00')
	expect(toOffsetDateTimeString('1969-12-31T00:00:00.000+13:00')).toEqual('1969-12-31T00:00:00+13:00')
})

test('isLocalDateString', () => {
	expect(isLocalDateString('2020-01-01')).toBeTruthy()
	expect(isLocalDateString('2020-1-01')).toBeFalsy()
	expect(isLocalDateString('2020-01-1')).toBeFalsy()
	expect(isLocalDateString('2020-1-1')).toBeFalsy()
})

test('isLocalTimeString', () => {
	expect(isLocalTimeString('12:01:00')).toBeTruthy()
	expect(isLocalTimeString('12:01:00.001')).toBeTruthy()
	expect(isLocalTimeString('12:01')).toBeTruthy()
	expect(isLocalTimeString('1201')).toBeFalsy()
	expect(isLocalTimeString('12:01:00.01')).toBeFalsy()
})

test('toLocalTimeString from string', () => {
	expect(toLocalTimeString('12:01')).toEqual('12:01:00')
	expect(toLocalTimeString('12:01:00')).toEqual('12:01:00')
	expect(toLocalTimeString('12:01:01')).toEqual('12:01:01')
	expect(toLocalTimeString('12:01:00.000')).toEqual('12:01:00')
	expect(toLocalTimeString('12:01:00.001')).toEqual('12:01:00.001')

	expect(toLocalTimeString('2020-12-05T12:01')).toEqual('12:01:00')
	expect(toLocalTimeString('1969-12-31T17:59')).toEqual('17:59:00')
	expect(toLocalTimeString('1969-12-31T17:59+12:00')).toEqual('17:59:00')
	expect(toLocalTimeString('1969-12-31T17:59-08:00')).toEqual('17:59:00')
	expect(toLocalTimeString('1969-12-31T17:59+13:00')).toEqual('17:59:00')
	expect(toLocalTimeString('1969-12-31T17:59Z')).toEqual('17:59:00')
})
