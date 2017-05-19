const {ticksNow, ticksAt, ticksFromDate, ticksToDate} = require('./index');

test('ticksAt gives 0 ticks for year 1', () => {
  expect(ticksAt(1, 0).toString()).toBe('0');
});

test('ticksAt gives the correct max date tick value', () => {
  expect(ticksAt(9999, 11, 31, 23, 59, 59, 9999999).toString()).toBe('3155378975999999999');
});
