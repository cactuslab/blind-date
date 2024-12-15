# Blind Date

A simple library to provide type-safety for immutable and `===`able dates in TypeScript using opaquely-typed strings.

Strings are the best representations for dates and times in JavaScript when you care about immutability and sameness, such as when you're working with [React](https://reactjs.org) components. Strings are also best when you're working with JSON, such as when using an API. You can use your favourite library to work with dates and times, but use Blind Date to represent the results.

## Using

```shell
npm install blind-date
```

```typescript
import {
	toLocalDateString,
	toLocalTimeString,
	toOffsetDateTimeString,
	toLocalDateTimeString,
	LocalDateTimeString,
	LocalDateString,
	LocalTimeString,
	OffsetDateTimeString
} from 'blind-date'
```

### with Moment.js

```typescript
import moment from 'moment'

const exampleMoment: moment.Moment = moment('22/1/2021 13:57', 'DD/MM/YYYY HH:mm')

const localDate: LocalDateString = toLocalDateString(exampleMoment)
// 2021-01-22

const localDateTime: LocalDateTimeString = toLocalDateTimeString(exampleMoment)
// 2021-01-22T13:57:00

const localTime: LocalTimeString = toLocalTimeString(exampleMoment)
// 13:57:00

const offsetDateTime: OffsetDateTimeString = toOffsetDateTimeString(exampleMoment)
// 2021-01-22T13:57:00+13:00
```

### with Luxon

```typescript
import { DateTime } from 'luxon'

const exampleDateTime: DateTime = DateTime.local(2021, 1, 22, 13, 57)

const localDate: LocalDateString = toLocalDateString(exampleDateTime)
// 2021-01-22

const localDateTime: LocalDateTimeString = toLocalDateTimeString(exampleDateTime)
// 2021-01-22T13:57:00

const localTime: LocalTimeString = toLocalTimeString(exampleDateTime)
// 13:57:00

const offsetDateTime: OffsetDateTimeString = toOffsetDateTimeString(exampleDateTime)
// 2021-01-22T13:57:00+13:00
```

### with strings

```typescript
const localDate: LocalDateString = toLocalDateString('2021-01-22')

const localDateTime: LocalDateTimeString = toLocalDateTimeString('2021-01-22T13:57:00')

const localTime: LocalTimeString = toLocalTimeString('13:57:00')

const offsetDateTime: OffsetDateTimeString = toOffsetDateTimeString('2021-01-22T13:57:00-08:00')
```

### with literal values

```typescript
const localDate: LocalDateString = toLocalDateString(2021, 1, 22)
// 2021-01-22

const localDateTime: LocalDateTimeString = toLocalDateTimeString(2021, 1, 22, 13, 57, 0)
// 2021-01-22T13:57:00

const localTime: LocalTimeString = toLocalTimeString(13, 57)
// 13:57:00

const offsetDateTime: OffsetDateTimeString = toOffsetDateTimeString(2021, 1, 22, 13, 57, 0, 0, -480)
// 2021-01-22T13:57:00-08:00
```

Or using object literals:

```typescript
const localDate: LocalDateString = toLocalDateString({ year: 2021, month: 1, day: 22 })
// 2021-01-22

const localDateTime: LocalDateTimeString = toLocalDateTimeString({
	year: 2021, month: 1, day: 22, hours: 13, minutes: 57
})
// 2021-01-22T13:57:00

const localTime: LocalTimeString = toLocalTimeString({ hours: 13, minutes: 57 })
// 13:57:00

const offsetDateTime: OffsetDateTimeString = toOffsetDateTimeString({
	year: 2021, month: 1, day: 22, hours: 13, minutes: 57, offset: -480
})
// 2021-01-22T13:57:00-08:00
```

### with millis

```typescript
const millis = 1611277020000

const localDate: LocalDateString = toLocalDateString(millis)
// 2021-01-22

const localDateTime: LocalDateTimeString = toLocalDateTimeString(millis)
// 2021-01-22T13:57:00

const localTime: LocalTimeString = toLocalTimeString(millis)
// 13:57:00

const offsetDateTime: OffsetDateTimeString = toOffsetDateTimeString(millis)
// 2021-01-22T13:57:00+13:00
```

## Compatibility

Blind Date uses ISO8601-formatted strings, and is compatible with [`Moment`](https://momentjs.com), `DateTime` from [Luxon](https://moment.github.io/luxon/), [`DayJs`](https://day.js.org), and JavaScript `Date`. Blind Date doesn't have any dependencies, and only supports these libraries if they are used in your project.

## The benefit of strings and the problem with Dates

Strings have two useful properties in JavaScript:

* they are immutable
* two strings that have the same contents are the exact same string, i.e. they `===` each other ([refer to MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is))

Conversely JavaScript's `Date` suffers from being mutable. You can call `setTime` on it and change the value the `Date` object contains. Furthermore, two `Date`s that represent exactly the same time are not necessarily `===`.

This makes strings a better representation than `Date` for dates and times in JavaScript. The second property of strings also makes strings a better representation than other date libraries that return their own object or function (as two identical values aren't `===`).

Immutability and sameness provide benefits when using React, as you avoid broken and unnecessary re-rendering due to mutated objects and or objects that have changed (according to `===` and `Object.is()`), but aren't actually different values.

## Opaque types

The problem with strings is that they look like any other string, losing the type-safety of your code. We adopt opaque types to resolve that.

Based on the article [Stronger JavaScript with Opaque Types](https://codemix.com/opaque-types-in-javascript/), we provide opaque types to represent our date and time values, so that you can maintain type-safety.

The types we define are:

* `LocalDateTimeString` e.g. "2020-12-05T09:44:00"
* `LocalDateString` e.g. "2020-12-05"
* `LocalTimeString` e.g. "09:44:00"
* `OffsetDateTimeString` e.g. "2020-12-05T09:44:00+12:00"

The values are still `string`s. The `typeof` still returns `string`, but TypeScript sees them as distinct from `string` so if you declare a parameter of type `LocalDateTimeString` you cannot simply pass a `string` to it, you have to first convert the string (or whatever else) to a `LocalDateTimeString`.

## Conversion functions

We provide conversion functions in order to create the various opaque types from: ISO8601 formatted strings, a UNIX epoch timestamp in millis, a [`Moment`](https://momentjs.com), [`DayJs`](https://day.js.org), `DateTime` from [Luxon](https://moment.github.io/luxon/), JavaScript `Date`, and Blind Date's own object literals.

```typescript
export type DateLike = string | number | moment.Moment | Dayjs | DateTime | Date | LiteralLocalDate | LiteralLocalDateTime | LiteralLocalTime | LiteralOffsetDateTime

export function toLocalDateTimeString(date: DateLike): LocalDateTimeString;
export function toLocalDateString(date: DateLike): LocalDateString;
export function toLocalTimeString(date: DateLike): LocalTimeString;
export function toOffsetDateTimeString(date: DateLike): OffsetDateTimeString;
```

### Local dates and times

A local date and or time does not include a timezone offset. A local date is well suited for a birthday, for example, as it's considered to be the same date no matter where in the world you are. A local time is well suited for a time of day such as noon, as it's 12:00pm no matter where in the world you are.

Local dates and times are also convenient when your application doesn't need to or doesn't want to consider timezones.

The `toLocal...` functions consider the timezone of the input date (if present), and output a local date and or time _in that timezone_. So even if you are in GMT+13:00 and call `toLocalTimeString('1969-12-31T17:59-08:00')` it will return `17:59:00` being the local time in the timezone of the offset date time provided.

Note that many date libraries discard the timezone information when parsing date times. If you do not get the results you expect, check the actual timezone information in the input to the `toLocal...` functions.

## Type guards

We provide [type guard functions](https://www.typescriptlang.org/docs/handbook/advanced-types.html#type-guards-and-differentiating-types) for narrowing a type to one of our date and time types:

```typescript
export function isLocalDateTimeString(date: unknown): date is LocalDateTimeString;
export function isLocalDateString(date: unknown): date is LocalDateString;
export function isLocalTimeString(date: unknown): date is LocalTimeString;
export function isOffsetDateTimeString(date: unknown): date is LocalDateString;
```

Passing any constant or variable to one of these functions will check to see if it is a string that matches the required format, and TypeScript will then treat your constant or variable as that type.

For example:

```typescript
import { isLocalDateTime } from 'blind-date'

function handleDateTime(value: string) {
	if (isLocalDateTimeString(value)) {
		// value is now typed LocalDateTimeString
	}
}
```

## Conversion to JavaScript Date

Blind Date can convert any date format it supports, including its own string types, to a JavaScript `Date`:

```typescript
export function toDate(date: DateLike): Date
```

## Validity

Some date formats can represent invalid dates, such as `moment`, `DateTime` and JavaScript's `Date` (when the `time` is `NaN`).
Blind Date can test any date format it supports to check if it's valid.

```typescript
export function isValid(date: DateLike): boolean
```

Note that Blind Date cannot represent an invalid date as a string, so an error will be thrown if an invalid date is passed
to any of the `to...` functions.
