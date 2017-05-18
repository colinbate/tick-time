const nano = require('nano-seconds');

const SECONDS_TO_EPOCH = 62135596800;
const MS_PER_SEC = 1000;
const NS_PER_TICK = 100;
const TICKS_PER_MS = 10000;
const MAX_TS = 253402300799999;
const MIN_TS = -62135596800000;

function toString() {
  const us = `${this[1]}`;
  if (this[0] === 0) {
    return us;
  }
  const pad = '0000000'.substring(0, 7 - us.length);
  return `${this[0]}${pad}${us}`;
}

function toMsTicks([secs, ticks]) {
  const tarr = [secs + SECONDS_TO_EPOCH, ticks];
  Object.defineProperty(tarr, 'toString', {
    value: toString
  });
  return Object.freeze(tarr);
}

function tsToArray(ts) {
  return [Math.trunc(ts / MS_PER_SEC), ~~(ts % MS_PER_SEC) * TICKS_PER_MS];
}

function rollOver(tickArr, overflow) {
  tickArr[1] += overflow;
  if (tickArr[1] < 0) {
    tickArr[1] += (TICKS_PER_MS * MS_PER_SEC);
    tickArr[0] -= 1;
  }
}

function at(...args) {
  if (args.length < 2) {
    throw new Error('This function needs to be called with at least two numbers.');
  }
  let ms = 0;
  let overflow = 0;
  if (args.length >= 7) {
    ms = Math.trunc(args[6] / TICKS_PER_MS);
    overflow = args[6] % TICKS_PER_MS;
    args[6] = ms;
  }
  console.log(`===
${ms} -- ${overflow}`);
  let point = Date.UTC(...args);
  if (point < MIN_TS || point > MAX_TS) {
    throw new Error('This date is out of range of standard .NET DateTime(Offset)');
  }
  if (args[0] < 100) {
    const pdate = new Date(point);
    pdate.setUTCFullYear(args[0]);
    point = pdate.getTime();
  }
  console.log(point);
  const arr = tsToArray(point);
  console.log(arr);
  if (overflow !== 0) {
    rollOver(arr, overflow);
  }
  console.log(arr);
  return toMsTicks(arr);
}

function from(dtObj) {
  if (Object.prototype.toString.call(dtObj) !== '[object Date]') {
    throw new Error('Argument is not a date object');
  }
  const point = dtObj.getTime();
  if (point < MIN_TS || point > MAX_TS) {
    throw new Error('This date is out of range of standard .NET DateTime(Offset)');
  }
  const arr = tsToArray(point);
  return toMsTicks(arr);
}

function now() {
  const [secs, ns] = nano.now();
  // ~~ is fast truncation for numbers which don't exceed 32 bits
  return toMsTicks([secs, ~~(ns / NS_PER_TICK)]);
}

console.log(at(1, 0).toString());

console.log(at(9999, 11, 31, 23, 59, 59, -10000400).toString());

module.exports = {
  now,
  at,
  from
};
