type Opaque<K, T> = T & { __TYPE__: K }

export type AnyDateString = LocalDateTimeString | LocalDateString | LocalTimeString | OffsetDateTimeString
export type LocalDateTimeString = Opaque<'LocalDateTimeString', string>
export type LocalDateString = Opaque<'LocalDateString', string>
export type LocalTimeString = Opaque<'LocalTimeString', string>
export type OffsetDateTimeString = Opaque<'OffsetDateTimeString', string>

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
	return date.match(/^[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}(:[0-9]{2}(\.[0-9]{3})?)?(Z|(\+|-)[0-9]{2}:[0-9]{2})$/) !== null
}

export type DateLike = string | MomentOrDayjsLike | DateTimeLike | Date

function isDateTime(date: DateLike): date is DateTimeLike {
	const anyDate = date as unknown as DateTimeLike
	return (typeof anyDate.offset === 'number' &&
		typeof anyDate.toMillis === 'function' &&
		typeof anyDate.toISO === 'function')
}

function isMoment(date: DateLike): date is MomentOrDayjsLike {
	const anyDate = date as unknown as MomentOrDayjsLike
	if (typeof anyDate.isValid === 'function' &&
		typeof anyDate.toDate === 'function' &&
		typeof anyDate.utcOffset === 'function') {
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

	function pad2(num: number): string {
		if (num < 10) {
			return `0${num}`
		} else {
			return `${num}`
		}
	}

	return (tz < 0 ? '-' : '+') + pad2(hours) + ':' + pad2(minutes)
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
			}
		}

		/* Local time */
		const localTimeMatch = date.match(/^([0-9]{2}):([0-9]{2})(:([0-9]{2})(\.([0-9]{3}))?)?$/)
		if (localTimeMatch) {
			const now = new Date()
			const parsed = new Date(now.getFullYear(), now.getMonth(), now.getDate(), Number(localTimeMatch[1]), Number(localTimeMatch[2]), localTimeMatch[4] ? Number(localTimeMatch[4]) : 0)
			if (localTimeMatch[6]) {
				parsed.setMilliseconds(Number(localTimeMatch[6]))
			}
			return {
				time: parsed.getTime(),
				offset: null, /* local */
			}
		}

		/* Local date time */
		const localDateTimeMatch = date.match(/^([0-9]{4})-([0-9]{2})-([0-9]{2})T([0-9]{2}):([0-9]{2}):([0-9]{2})(\.([0-9]{3}))?$/)
		if (localDateTimeMatch) {
			const parsed = new Date(Number(localDateTimeMatch[1]), Number(localDateTimeMatch[2]) - 1, Number(localDateTimeMatch[3]),
				Number(localDateTimeMatch[4]), Number(localDateTimeMatch[5]), Number(localDateTimeMatch[6]))
			if (localDateTimeMatch[8]) {
				parsed.setMilliseconds(Number(localDateTimeMatch[8]))
			}
			return {
				time: parsed.getTime(),
				offset: null, /* local */
			}
		}

		/* General parsing */
		const parsed = new Date(date)
		if (isNaN(parsed.getTime())) {
			throw new Error(`Invalid date string: ${date}`)
		}

		return {
			time: new Date(date).getTime(),
			offset: timezoneFromString(date),
		}
	} else if (isDateTime(date)) {
		return {
			time: date.toMillis(),
			offset: date.offset,
		}
	} else if (date instanceof Date) {
		return {
			time: date.getTime(),
			offset: null,
		}
	} else if (isMoment(date)) {
		if (!date.isValid()) {
			throw new Error('Invalid date object provided')
		}
		return {
			time: date.toDate().getTime(),
			offset: date.utcOffset(),
		}
	} else {
		throw new Error(`Unsupported date argument: ${date}`)
	}
}

function toISODateTimeStringNoTimezone(date: InternalDate): string {
	const tz = date.offset !== null ? date.offset : -new Date(date.time).getTimezoneOffset()
	return new Date(date.time + tz * 60000).toISOString()
		.replace(/Z$/, '')
		.replace(/\.000$/, '')
}

function formatLocalDateTimeString(date: InternalDate): string {
	return toISODateTimeStringNoTimezone(date)
}

function formatLocalDateString(date: InternalDate): string {
	const dateString = toISODateTimeStringNoTimezone(date)
	const i = dateString.indexOf('T')
	if (i !== -1) {
		return dateString.substring(0, i)
	} else {
		throw new Error(`Invalid ISO date: ${dateString}`)
	}
}

function formatLocalTimeString(date: InternalDate): string {
	const dateString = toISODateTimeStringNoTimezone(date)
	const i = dateString.indexOf('T')
	if (i !== -1) {
		return dateString.substring(i + 1)
	} else {
		throw new Error(`Invalid ISO date: ${dateString}`)
	}
}

function formatOffsetDateTimeString(date: InternalDate): string {
	return toISODateTimeStringNoTimezone(date) + timezoneString(date)
}

export function toLocalDateTimeString(date: DateLike): LocalDateTimeString {
	return formatLocalDateTimeString(parse(date)) as LocalDateTimeString
}

export function toLocalDateString(date: DateLike): LocalDateString {
	return formatLocalDateString(parse(date)) as LocalDateString
}

export function toLocalTimeString(date: DateLike): LocalTimeString {
	return formatLocalTimeString(parse(date)) as LocalTimeString
}

export function toOffsetDateTimeString(date: DateLike): OffsetDateTimeString {
	return formatOffsetDateTimeString(parse(date)) as OffsetDateTimeString
}
