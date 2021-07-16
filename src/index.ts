
import { DateTime, FixedOffsetZone } from 'luxon'

type Opaque<K, T> = T & { __TYPE__: K }

export type AnyDateString = LocalDateTimeString | LocalDateString | LocalTimeString | OffsetDateTimeString
export type LocalDateTimeString = Opaque<'LocalDateTimeString', string>
export type LocalDateString = Opaque<'LocalDateString', string>
export type LocalTimeString = Opaque<'LocalTimeString', string>
export type OffsetDateTimeString = Opaque<'OffsetDateTimeString', string>

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

/**
 * A type that looks like a Moment of Dayjs, so we don't need to import or, more
 * particularly, export Moment or Dayjs types.
 */
export interface MomentOrDayjsLike {
	isValid(): boolean
	toISOString(): string
	utcOffset(): number
}

/**
 * A type that looks like a Luxon DateTime, so we don't need to import or, more
 * particularly, export Luxon types.
 */
export interface LuxonLike {
	day: number
	daysInMonth: number
	daysInYear: number
	invalidReason: string | null
	invalidExplanation: string | null
	zoneName: string
}

export type DateLike = string | MomentOrDayjsLike | LuxonLike | Date

function isMomentOrDayjsLike(date: DateLike): date is MomentOrDayjsLike {
	const anyDate = date as unknown as MomentOrDayjsLike
	if (typeof anyDate.isValid === 'function' &&
		typeof anyDate.toISOString === 'function' &&
		typeof anyDate.utcOffset === 'function') {
		return true
	}

	return false
}

function parse(date: DateLike): DateTime {
	if (typeof date === 'string') {
		return DateTime.fromISO(date, { setZone: true })
	} else if (DateTime.isDateTime(date)) {
		return date
	} else if (date instanceof Date) {
		return DateTime.fromJSDate(date)
	} else if (isMomentOrDayjsLike(date)) {
		if (!date.isValid()) {
			throw new Error('Invalid date object provided')
		}
		return DateTime.fromISO(date.toISOString()).setZone(FixedOffsetZone.instance(date.utcOffset()))
	} else {
		throw new Error(`Unsupported date argument: ${date}`)
	}
}

function formatLocalDateTimeString(date: DateTime): string {
	return date.toFormat('yyyy-MM-dd\'T\'HH:mm:ss.SSS').replace(/\.000$/, '')
}

function formatLocalDateString(date: DateTime): string {
	return date.toISODate()
}

function formatLocalTimeString(date: DateTime): string {
	return date.toFormat('HH:mm:ss.SSS').replace(/\.000$/, '')
}

function formatOffsetDateTimeString(date: DateTime): string {
	return date.toFormat('yyyy-MM-dd\'T\'HH:mm:ss.SSSZZ').replace(/\.000($|\+|-)/, '$1').replace(/\+00:00$/, 'Z')
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
