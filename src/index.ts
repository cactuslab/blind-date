type Opaque<K, T> = T & { __TYPE__: K }

export type AnyDateString = LocalDateTimeString | LocalDateString | LocalTimeString | OffsetDateTimeString
export type LocalDateTimeString = Opaque<'LocalDateTimeString', string>
export type LocalDateString = Opaque<'LocalDateString', string>
export type LocalTimeString = Opaque<'LocalTimeString', string>
export type OffsetDateTimeString = Opaque<'OffsetDateTimeString', string>

export interface LiteralLocalDate {
	year: number
	month: number
	day?: number
}

export interface LiteralLocalTime {
	hours: number
	minutes: number
	seconds?: number
	milliseconds?: number
}

export interface LiteralLocalDateTime extends LiteralLocalDate, LiteralLocalTime {
	day: number
}

export interface LiteralOffsetDateTime extends LiteralLocalDateTime {
	/** Timezone offset in minutes */
	offset: number
}

/**
 * A type that looks like a Moment of Dayjs, so we don't need to import or, more
 * particularly, export Moment or Dayjs types.
 */
export interface MomentOrDayjsLike {
	isValid(): boolean
	toDate(): Date
	utcOffset(): number
}

/**
 * A type that looks like a Luxon DateTime, so we don't need to import or, more
 * particularly, export Luxon types.
 */
export interface DateTimeLike {
	isValid: boolean
	offset: number
	toISO(): string
	toMillis(): number
}

export function isLocalDateTimeString(date: unknown): date is LocalDateTimeString {
	if (typeof date !== 'string') {
		return false
	}
	return date.match(/^[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}(:[0-9]{2}(\.[0-9]{3})?)?$/) !== null
}

export function isLocalDateString(date: unknown): date is LocalDateString {
	if (typeof date !== 'string') {
		return false
	}
	return date.match(/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/) !== null
}

export function isLocalTimeString(date: unknown): date is LocalTimeString {
	if (typeof date !== 'string') {
		return false
	}
	return date.match(/^[0-9]{2}:[0-9]{2}(:[0-9]{2}(\.[0-9]{3})?)?$/) !== null
}

export function isOffsetDateTimeString(date: unknown): date is LocalDateString {
	if (typeof date !== 'string') {
		return false
	}
	return date.match(/^[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}(:[0-9]{2}(\.[0-9]+)?)?(Z|(\+|-)[0-9]{2}:[0-9]{2})$/) !== null
}

export type DateLike = string | number | MomentOrDayjsLike | DateTimeLike | Date | LiteralLocalDate | LiteralLocalDateTime | LiteralLocalTime | LiteralOffsetDateTime

function isDateTime(date: DateLike): date is DateTimeLike {
	if (typeof date !== 'object') {
		return false
	}
	
	const anyDate = date as unknown as DateTimeLike
	return (typeof anyDate.offset === 'number' &&
		typeof anyDate.toMillis === 'function' &&
		typeof anyDate.toISO === 'function')
}

function isMoment(date: DateLike): date is MomentOrDayjsLike {
	if (typeof date !== 'object') {
		return false
	}
	
	const anyDate = date as unknown as MomentOrDayjsLike
	if (typeof anyDate.isValid === 'function' &&
		typeof anyDate.toDate === 'function' &&
		typeof anyDate.utcOffset === 'function') {
		return true
	}

	return false
}

function isLiteralDateTime(date: DateLike): date is LiteralLocalDateTime {
	if (typeof date !== 'object') {
		return false
	}

	const anyDate = date as unknown as LiteralOffsetDateTime
	if (typeof anyDate.year === 'number' &&
		typeof anyDate.month === 'number' &&
		typeof anyDate.day === 'number' &&
		typeof anyDate.hours === 'number' &&
		typeof anyDate.minutes === 'number' &&
		(typeof anyDate.seconds === 'number' || typeof anyDate.seconds === 'undefined') &&
		(typeof anyDate.milliseconds === 'number' || typeof anyDate.milliseconds === 'undefined') &&
		typeof anyDate.offset === 'undefined') {
		return true
	}

	return false
}

function isLiteralDate(date: DateLike): date is LiteralLocalDate {
	if (typeof date !== 'object') {
		return false
	}

	const anyDate = date as unknown as LiteralOffsetDateTime
	if (typeof anyDate.year === 'number' &&
		typeof anyDate.month === 'number' &&
		(typeof anyDate.day === 'number' || typeof anyDate.day === 'undefined') &&
		typeof anyDate.hours === 'undefined' &&
		typeof anyDate.minutes === 'undefined' &&
		typeof anyDate.seconds === 'undefined' &&
		typeof anyDate.milliseconds === 'undefined' &&
		typeof anyDate.offset === 'undefined') {
		return true
	}

	return false
}

function isLiteralTime(date: DateLike): date is LiteralLocalTime {
	if (typeof date !== 'object') {
		return false
	}

	const anyDate = date as unknown as LiteralOffsetDateTime
	if (typeof anyDate.year === 'undefined' &&
		typeof anyDate.month === 'undefined' &&
		typeof anyDate.day === 'undefined' &&
		typeof anyDate.hours === 'number' &&
		typeof anyDate.minutes === 'number' &&
		(typeof anyDate.seconds === 'number' || typeof anyDate.seconds === 'undefined') &&
		(typeof anyDate.milliseconds === 'number' || typeof anyDate.milliseconds === 'undefined') &&
		typeof anyDate.offset === 'undefined') {
		return true
	}

	return false
}

function isLiteralOffsetDateTime(date: DateLike): date is LiteralOffsetDateTime {
	if (typeof date !== 'object') {
		return false
	}

	const anyDate = date as unknown as LiteralOffsetDateTime
	if (typeof anyDate.year === 'number' &&
		typeof anyDate.month === 'number' &&
		typeof anyDate.day === 'number' &&
		typeof anyDate.hours === 'number' &&
		typeof anyDate.minutes === 'number' &&
		(typeof anyDate.seconds === 'number' || typeof anyDate.seconds === 'undefined') &&
		(typeof anyDate.milliseconds === 'number' || typeof anyDate.milliseconds === 'undefined') &&
		typeof anyDate.offset === 'number') {
		return true
	}

	return false
}

/**
 * Our internal representation of dates.
 */
interface InternalDate {
	/* epoch time in milliseconds */
	time: number
	/* timezone in minutes; null means it's a local timestamp */
	offset: number | null
	valid: boolean
	input: DateLike
}

/**
 * Returns the timezone offset in minutes from the given date string, or null if there isn't one.
 * @param date an ISO date string
 * @returns 
 */
function timezoneFromString(date: string): number | null {
	if (date.endsWith('Z')) {
		return 0
	}

	const match = date.match(/(\+|-)([0-9][0-9]):([0-9][0-9])$/)
	if (!match) {
		return null
	}

	const sign = match[1]
	const hours = Number(match[2])
	const minutes = Number(match[3])

	return (sign === '-' ? -1 : 1) * hours * 60 + minutes
}

/**
 * Returns an ISO string representing the timezone of the given internal date.
 * If the internal date is a local date then the appropriate offset for the date
 * in the current system timezone is used.
 * @param date a date
 * @returns 
 */
function timezoneString(date: InternalDate): string {
	const tz = date.offset !== null ? date.offset : -new Date(date.time).getTimezoneOffset()
	if (date.offset === 0) {
		return 'Z'
	}
	const hours = Math.floor(Math.abs(tz) / 60)
	const minutes = Math.abs(tz) % 60

	return (tz < 0 ? '-' : '+') + pad(hours, 2) + ':' + pad(minutes, 2)
}

function pad(num: number, n: number): string {
	let result = String(num)
	while (result.length < n) {
		result = '0' + result
	}
	return result
}

/**
 * Parse any given date-like thing into an InternalDate
 * @param date 
 * @returns 
 */
function parse(date: DateLike): InternalDate {
	if (typeof date === 'string') {
		/* Local date */
		const localDateMatch = date.match(/^([0-9]{4})-([0-9]{2})-([0-9]{2})$/)
		if (localDateMatch) {
			const parsed = new Date(Number(localDateMatch[1]), Number(localDateMatch[2]) - 1, Number(localDateMatch[3]))
			return {
				time: parsed.getTime(),
				offset: null, /* local */
				valid: true,
				input: date,
			}
		}

		/* Local time */
		const localTimeMatch = date.match(/^([0-9]{2}):([0-9]{2})(:([0-9]{2})(\.([0-9]+))?)?$/)
		if (localTimeMatch) {
			const now = new Date()
			const parsed = new Date(now.getFullYear(), now.getMonth(), now.getDate(), Number(localTimeMatch[1]), Number(localTimeMatch[2]), localTimeMatch[4] ? Number(localTimeMatch[4]) : 0)
			if (localTimeMatch[6]) {
				parsed.setMilliseconds(Number(localTimeMatch[6]))
			}
			return {
				time: parsed.getTime(),
				offset: null, /* local */
				valid: true,
				input: date,
			}
		}

		/* Local date time */
		const localDateTimeMatch = date.match(/^([0-9]{4})-([0-9]{2})-([0-9]{2})T([0-9]{2}):([0-9]{2})(:([0-9]{2})(\.([0-9]+))?)?$/)
		if (localDateTimeMatch) {
			const parsed = new Date(Number(localDateTimeMatch[1]), Number(localDateTimeMatch[2]) - 1, Number(localDateTimeMatch[3]),
				Number(localDateTimeMatch[4]), Number(localDateTimeMatch[5]), Number(localDateTimeMatch[7] ? localDateTimeMatch[7] : 0))
			if (localDateTimeMatch[9]) {
				parsed.setMilliseconds(Number(localDateTimeMatch[9]))
			}
			return {
				time: parsed.getTime(),
				offset: null, /* local */
				valid: true,
				input: date,
			}
		}

		/* Offset date time */
		if (isOffsetDateTimeString(date)) {
			return {
				time: new Date(date).getTime(),
				offset: timezoneFromString(date),
				valid: true,
				input: date,
			}
		}

		return {
			time: NaN,
			offset: null,
			valid: false,
			input: date,
		}
	} else if (typeof date === 'number') {
		return {
			time: date,
			offset: null,
			valid: !isNaN(date),
			input: date,
		}
	} else if (isDateTime(date)) {
		if (!date.isValid) {
			return {
				time: NaN,
				offset: null,
				valid: false,
				input: date,
			}
		}
		return {
			time: date.toMillis(),
			offset: date.offset,
			valid: true,
			input: date,
		}
	} else if (date instanceof Date) {
		if (isNaN(date.getTime())) {
			return {
				time: NaN,
				offset: null,
				valid: false,
				input: date,
			}
		}
		return {
			time: date.getTime(),
			offset: null,
			valid: true,
			input: date,
		}
	} else if (isMoment(date)) {
		if (!date.isValid()) {
			return {
				time: NaN,
				offset: null,
				valid: false,
				input: date,
			}
		}
		return {
			time: date.toDate().getTime(),
			offset: date.utcOffset(),
			valid: true,
			input: date,
		}
	} else if (isLiteralOffsetDateTime(date)) {
		const value = new Date(date.year, date.month - 1, date.day, date.hours, date.minutes, date.seconds || 0, date.milliseconds || 0)
		const offset = value.getTimezoneOffset()
		return {
			time: value.getTime() - offset * 60000 - date.offset * 60000,
			offset: date.offset,
			valid: true,
			input: date,
		}
	} else if (isLiteralDateTime(date)) {
		return {
			time: new Date(date.year, date.month - 1, date.day, date.hours, date.minutes, date.seconds || 0, date.milliseconds || 0).getTime(),
			offset: null,
			valid: true,
			input: date,
		}
	} else if (isLiteralDate(date)) {
		return {
			time: new Date(date.year, date.month - 1, date.day || 1).getTime(),
			offset: null,
			valid: true,
			input: date,
		}
	} else if (isLiteralTime(date)) {
		/* Use a known date so there are no daylight savings issues (hopefully there were no daylight savings changes on that day) */
		const millis = new Date(1970, 0, 1, date.hours, date.minutes, date.seconds || 0, date.milliseconds || 0).getTime()
		return {
			time: millis,
			offset: null,
			valid: true,
			input: date,
		}
	} else {
		return {
			time: NaN,
			offset: null,
			valid: false,
			input: date,
		}
	}
}

function assertValidDate(date: InternalDate, purpose: string) {
	if (date.valid) {
		return
	}

	if (isDateTime(date.input)) {
		throw new Error(`blind-date cannot use invalid DateTime ${purpose}: ${date.input}`)
	} else if (isMoment(date.input)) {
		throw new Error(`blind-date cannot use invalid Moment ${purpose}: ${date.input}`)
	} else if (typeof date.input === 'object') {
		throw new Error(`blind-date cannot use invalid input ${purpose}: ${JSON.stringify(date.input)}`)
	} else if (typeof date.input === 'string') {
		throw new Error(`blind-date cannot use invalid input ${purpose}: ${date.input}`)
	} else {
		throw new Error(`blind-date cannot use invalid input ${purpose}: ${date.input}`)
	}
}

/**
 * Returns an ISO string for the given date as a local date time in the timezone
 * offset given in the date
 * @param date 
 * @returns 
 */
function toLocalISODateTimeString(date: InternalDate): string {
	assertValidDate(date, 'to format a string')

	/* In order to make a local date time string in the given timezone offset we bump the time
	   in millis by the offset, then format an ISO string (which will be UTC), and then remove
	   the timezone specifier so the timezone can be added later.
	 */
	const tz = date.offset !== null ? date.offset : -new Date(date.time).getTimezoneOffset()
	return new Date(date.time + tz * 60000).toISOString()
		.replace(/Z$/, '')
		.replace(/\.000$/, '')
}

function formatLocalDateTimeString(date: InternalDate): string {
	return toLocalISODateTimeString(date)
}

function formatLocalDateString(date: InternalDate): string {
	const dateString = toLocalISODateTimeString(date)
	const i = dateString.indexOf('T')
	if (i !== -1) {
		return dateString.substring(0, i)
	} else {
		throw new Error(`blind-date produced an invalid ISO date: ${dateString}`)
	}
}

function formatLocalTimeString(date: InternalDate): string {
	const dateString = toLocalISODateTimeString(date)
	const i = dateString.indexOf('T')
	if (i !== -1) {
		return dateString.substring(i + 1)
	} else {
		throw new Error(`blind-date produced an invalid ISO date: ${dateString}`)
	}
}

function formatOffsetDateTimeString(date: InternalDate): string {
	return toLocalISODateTimeString(date) + timezoneString(date)
}

export function toLocalDateTimeString(date: DateLike): LocalDateTimeString
export function toLocalDateTimeString(year: number, month: number, day: number, hours: number, minutes: number, seconds?: number, milliseconds?: number): LocalDateTimeString
export function toLocalDateTimeString(dateOrYear: DateLike | number, month?: number, day?: number, hours?: number, minutes?: number, seconds?: number, milliseconds?: number): LocalDateTimeString {
	if (typeof dateOrYear === 'number' && typeof month === 'number') {
		let result = `${pad(dateOrYear, 4)}-${pad(month || 1, 2)}-${pad(day || 1, 2)}T${pad(hours || 0, 2)}:${pad(minutes || 0, 2)}:${pad(seconds || 0, 2)}`
		if (milliseconds && milliseconds > 0) {
			result += `.${pad(milliseconds, 3)}`
		}
		return result as LocalDateTimeString
	} else {
		return formatLocalDateTimeString(parse(dateOrYear)) as LocalDateTimeString
	}
}

export function toLocalDateString(date: DateLike): LocalDateString
export function toLocalDateString(year: number, month: number, day?: number): LocalDateString
export function toLocalDateString(dateOrYear: DateLike | number, month?: number, day?: number): LocalDateString {
	if (typeof dateOrYear === 'number' && typeof month === 'number') {
		dateOrYear = new Date(dateOrYear, month !== undefined ? month - 1 : 0, typeof day !== undefined ? day : 1)
	}
	return formatLocalDateString(parse(dateOrYear)) as LocalDateString
}

export function toLocalTimeString(date: DateLike): LocalTimeString
export function toLocalTimeString(hours: number, minutes: number, seconds?: number, milliseconds?: number): LocalTimeString
export function toLocalTimeString(dateOrHours: DateLike | number, minutes?: number, seconds?: number, milliseconds?: number): LocalTimeString {
	if (typeof dateOrHours === 'number' && typeof minutes === 'number') {
		/* Use UTC so there are no daylight savings issues */
		const millis = Date.UTC(1970, 0, 1, dateOrHours || 0, minutes || 0, seconds || 0, milliseconds || 0)
		const parsed = parse(millis)
		parsed.offset = 0
		return formatLocalTimeString(parsed) as LocalTimeString
	} else {
		return formatLocalTimeString(parse(dateOrHours)) as LocalTimeString
	}
}

export function toOffsetDateTimeString(date: DateLike): OffsetDateTimeString
export function toOffsetDateTimeString(year: number, month: number, day: number, hours: number, minutes: number, seconds?: number, milliseconds?: number, offset?: number): OffsetDateTimeString
export function toOffsetDateTimeString(dateOrYear: DateLike | number, month?: number, day?: number, hours?: number, minutes?: number, seconds?: number, milliseconds?: number, offset?: number): OffsetDateTimeString {
	if (typeof dateOrYear === 'number' && typeof month === 'number') {
		if (offset !== undefined) {
			/* When there's an explicit offset we use UTC to avoid any daylight savings rules */
			let millis = Date.UTC(
				dateOrYear,
				month !== undefined ? month - 1 : 0,
				day !== undefined ? day : 1,
				hours,
				minutes,
				seconds,
				milliseconds
			)

			/* Correct for the given offset */
			millis -= offset * 60000
			
			const parsed = parse(millis)
			parsed.offset = offset

			let result = toLocalISODateTimeString(parsed)
			result += timezoneString({
				time: millis,
				offset,
				valid: true,
				input: millis,
			})
			return result as OffsetDateTimeString
		} else {
			/* Create a local date */
			const date = new Date(
				dateOrYear,
				month !== undefined ? month - 1 : 0,
				day !== undefined ? day : 1,
				hours || 0,
				minutes || 0,
				seconds || 0,
				milliseconds || 0
			)
			let result = toLocalISODateTimeString(parse(date))
			result += timezoneString({
				time: date.getTime(),
				offset: null,
				valid: true,
				input: date,
			})
			return result as OffsetDateTimeString
		}
	} else {
		return formatOffsetDateTimeString(parse(dateOrYear)) as OffsetDateTimeString
	}
}

export function toDate(date: DateLike): Date {
	const parsed = parse(date)
	assertValidDate(parsed, 'to create a Date')
	return new Date(parsed.time)
}

export function isValid(date: DateLike): boolean {
	const parsed = parse(date)
	return parsed.valid
}
