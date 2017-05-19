const {ticksNow, ticksAt, ticksFromDate, ticksToDate} = require('./index');

test('ticksAt gives 0 ticks for year 1', () => {
  expect(ticksAt(1, 0).toString()).toBe('0');
});

test('ticksAt gives the correct max date tick value', () => {
  expect(ticksAt(9999, 11, 31, 23, 59, 59, 9999999).toString()).toBe('3155378975999999999');
});

test('ticksNow and ticksFromDate with current Date should be close', () => {
  const tnow = ticksNow();
  const tnowd = ticksFromDate(new Date());
  expect(Math.abs(tnow[0] - tnowd[0])).toBeLessThan(2);
});

test('ticksFromDate and ticksToDate round-trip', () => {
  expect(ticksFromDate(ticksToDate('0')).toString()).toBe('0');
  expect(ticksFromDate(ticksToDate('12345678901234567')).toString()).toBe('12345678901234567');
  const someDay = new Date(2016, 4, 4, 12, 0, 0);
  expect(ticksToDate(ticksFromDate(someDay)).toString()).toEqual(someDay.toString());
});

test('ticksToDate captures the tick count in the Date object', () => {
  const date = ticksToDate('12345678901234567');
  expect(date.getTicks()).toEqual(4567);
});

test('ticksAt throws with less than two arguments', () => {
  expect(() => ticksAt(1)).toThrow();
});

test('ticksAt will throw when date is outside normal .NET range', () => {
  expect(() => ticksAt(-1, 1)).toThrow();
  expect(() => ticksAt(10000, 1)).toThrow();
});

test('ticksFromDate will throw if not given a Date object', () => {
  expect(() => ticksFromDate('today')).toThrow();
  expect(() => ticksFromDate(1234567890)).toThrow();
});

test('ticksFromDate will throw when date is outside normal .NET range', () => {
  expect(() => ticksFromDate(new Date(-1, 1))).toThrow();
  expect(() => ticksFromDate(new Date(10000, 1))).toThrow();
});

test('ticksAt handles negative ticks provided', () => {
  expect(ticksAt(2000, 0, 1, 0, 0, 0, 0).toString()).toEqual('630822816000000000');
  expect(ticksAt(2000, 0, 1, 0, 0, 0, -400).toString()).toEqual('630822815999999600');
});
