# tick-time

Provides methods to create tick count similar to what is available in .NET

This was built for Node 6+. It isn't transpiled into ES5. If you need it to work in the browser, then you should be able to use the `browser-process-hrtime` package as a shim. Browser use not tested at this time.

## Install

```
yarn add tick-time
```
or
```
npm install -S tick-time
```

## Usage

There are three functions available for use.

The return value of all functions is an array in the form: `[seconds, one-tenth-microseconds]`. This is because JavaScript can't natively handle numbers in the same range as .NET `long` integers (64 bits). This array is readonly.

If you want the full count as a string, you can just call `.toString()` on the returned array, or use it in a string context:

```js
const str = `This many ticks: ${tt.now()}`;
```

### `now`

Likely the most useful function, as ticks are often used to capture the fine grained current point in time.

```js
const tt = require('tick-time');

const ticks = tt.now();
```

### `at`

Returns a tick value at a particular point in time.

### `from`

Creates a tick value from a Date object.

