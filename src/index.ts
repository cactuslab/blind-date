
import { DateTime, FixedOffsetZone } from 'luxon'
import dayjs, { Dayjs } from 'dayjs'
import moment from 'moment'

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

export type DateLike = string | moment.Moment | DateTime | Dayjs | Date

function parse(date: DateLike): DateTime {
	if (typeof date === 'string') {
		return DateTime.fromISO(date, { setZone: true })
	} else if (moment && moment.isMoment(date)) {
		if (!date.isValid()) {
			throw new Error('Invalid Moment provided')
		}
		return DateTime.fromISO(date.toISOString()).setZone(FixedOffsetZone.instance(date.utcOffset()))
	} else if (DateTime.isDateTime(date)) {
		return date
	} else if (dayjs && dayjs.isDayjs(date)) {
		if (!date.isValid()) {
			throw new Error('Invalid DayJs provided')
		}
		return DateTime.fromISO(date.toISOString()).setZone(FixedOffsetZone.instance(date.utcOffset()))
	} else if (date instanceof Date) {
		return DateTime.fromJSDate(date)
	} else {
		throw new Error(`Unsupported date argument: ${date}`)
	}
}

function formatLocalDateTimeString(date: DateTime): string {
	return date.toFormat('yyyy-MM-dd\'T\'HH:mm:ss.SSS').replace(/\.000$/, '')
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
	return parse(date).toISODate() as LocalDateString
}

export function toLocalTimeString(date: DateLike): LocalTimeString {
	return formatLocalTimeString(parse(date)) as LocalTimeString
}

export function toOffsetDateTimeString(date: DateLike): OffsetDateTimeString {
	return formatOffsetDateTimeString(parse(date)) as OffsetDateTimeString
}
