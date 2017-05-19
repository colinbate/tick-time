# tick-time

Provides methods to create tick count similar to what is available in .NET

This was built for Node 6+. It isn't transpiled into ES5. If you need it to work in the browser, then you should be able to use the `browser-process-hrtime` package as a shim. Browser use not tested at this time.

This package is intended for use when you need to interact with a .NET based API which accepts or requires a tick count.

## Install

```
yarn add tick-time
```
or
```
npm install -S tick-time
```

## Usage

There are four functions available for use.

The return value of all functions returning ticks is an array in the form: `[seconds, one-tenth-microseconds]`. This is because JavaScript can't natively handle numbers in the same range as .NET `long` integers (64 bits). This array is readonly.

If you want the full tick count as a string, you can just call `.toString()` on the returned array, or use it in a string context:

```js
const str = `This many ticks: ${tt.now()}`;
```

### `ticksNow`

Likely the most useful function, as ticks are often used to capture the fine grained current point in time.

```js
const {ticksNow} = require('tick-time');

const ticks = ticksNow();
```

### `ticksAt`

Returns a tick value at a particular point in time. Accepts parameters similar to Date.UTC (times are considered as UTC). There are two primary differences between this and Date.UTC.

1. The last parameter is considered to be ticks, not milliseconds. So a three digit ms value provided before won't even register as any ms at all.
2. If the year is less than 100, it is still treated as the full year. Date.UTC will add 1900 to the year in that case. This function does not do that.

```js
const {ticksAt} = require('tick-time');

const afterY2k = ticksAt(2000, 0, 1, 0, 0, 0, 1234567);
```

### `ticksFromDate`

Creates a tick value from a Date object. If the Date object has a `getTicks()` function, it will be called to fetch the extra ticks to add. This is useful if you need to round-trip from the `ticksToDate()` function.

```js
const {ticksFromDate} = require('tick-time');

const nowish = new Date();
console.log(ticksFromDate(nowish).toString());
```

### `ticksToDate`

This function will convert either a tick string or array structure returned from the other functions into a Date object. The Date object is augmented with a `getTicks()` function returning any ticks which would otherwise be lost converting to the less precise object.

```js
const {ticksToDate} = require('tick-time');

const y2k = ticksToDate('630822816000000000');
```
