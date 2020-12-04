import { DateTimeFormatter, LocalDate, LocalDateTime, LocalTime, nativeJs, OffsetDateTime, Temporal, ZoneOffset } from '@js-joda/core'
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

function parse(date: string | moment.Moment | Date): Temporal {
	if (typeof date === 'string') {
		if (isLocalDateTimeString(date)) {
			return LocalDateTime.parse(date)
		} else if (isLocalDateString(date)) {
			return LocalDate.parse(date)
		} else if (isLocalTimeString(date)) {
			return LocalTime.parse(date)
		} else if (isOffsetDateTimeString(date)) {
			return OffsetDateTime.parse(date)
		} else {
			throw new Error(`Unrecognised date format: ${date}`)
		}
	} else if (moment && moment.isMoment(date)) {
		if (!date.isValid()) {
			throw new Error('Invalid moment provided')
		}

		/* We parse the moment using the appropriate UTC offset */
		const offset = date.utcOffset()
		return OffsetDateTime.parse(date.toISOString()).withOffsetSameInstant(ZoneOffset.ofTotalMinutes(offset))
	} else {
		return OffsetDateTime.from(nativeJs(date))
	}
}

export function toLocalDateTimeString(date: string | moment.Moment | Date): LocalDateTimeString {
	return LocalDateTime.from(parse(date)).format(DateTimeFormatter.ISO_LOCAL_DATE_TIME) as LocalDateTimeString
}

export function toLocalDateString(date: string | moment.Moment | Date): LocalDateString {
	return LocalDate.from(parse(date)).format(DateTimeFormatter.ISO_LOCAL_DATE) as LocalDateString
}

export function toLocalTimeString(date: string | moment.Moment | Date): LocalTimeString {
	return LocalTime.from(parse(date)).format(DateTimeFormatter.ISO_LOCAL_TIME) as LocalTimeString
}

export function toOffsetDateTimeString(date: string | moment.Moment | Date): OffsetDateTimeString {
	return OffsetDateTime.from(parse(date)).format(DateTimeFormatter.ISO_OFFSET_DATE_TIME) as OffsetDateTimeString
}
