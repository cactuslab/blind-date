import { toLocalDateTimeString } from '..'

test('strange input', () => {
	expect(toLocalDateTimeString('2 August 1998')).toEqual('1998-08-02T00:00:00')
	// expect(toOffsetDateTimeString('2 August 1998')).toEqual('1998-08-02T00:00:00')
})
