export enum Timezone {
	PacificAuckland,
	AmericaLosAngeles
}

export function offsetInJanuary(timezone: Timezone): string {
	switch (timezone) {
		case Timezone.PacificAuckland: return '+13:00'
		case Timezone.AmericaLosAngeles: return '-08:00'
	}
}

export function offsetInJanuary1970(timezone: Timezone): string {
	switch (timezone) {
		case Timezone.PacificAuckland: return '+12:00'
		case Timezone.AmericaLosAngeles: return '-08:00'
	}
}

export function offsetInJuly(timezone: Timezone): string {
	switch (timezone) {
		case Timezone.PacificAuckland: return '+12:00'
		case Timezone.AmericaLosAngeles: return '-07:00'
	}
}

export function currentTimezone(): Timezone {
	const d = new Date(2020, 0, 1)
	const offset = -d.getTimezoneOffset()
	switch (offset) {
		case 780:
			return Timezone.PacificAuckland
		case -480:
			return Timezone.AmericaLosAngeles
		default:
			throw new Error(`Please add support for timezone offset ${offset} to the ${__filename}`)
	}
}
