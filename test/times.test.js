/* eslint-env mocha */
const assert = require('assert');
const moment = require('moment');

const times = require('../src/times');

describe('something', () => {
  it('should return something', () => {
    const expected = times.convertDataTimeToMinutes('2hrs 20min');
    const result = 140;
    assert.ok(result === expected);
  });
});

describe('next night and day forecasts', () => {
  it('should filter the forecasts correctly', () => {
    const forecast = [
      { utcTime: '2018-05-07T06:00:00.00' },
      { utcTime: '2018-05-07T07:00:00.00' },
      { utcTime: '2018-05-07T08:00:00.00' },
      { utcTime: '2018-05-07T09:00:00.00' },
      { utcTime: '2018-05-07T10:00:00.00' },
      { utcTime: '2018-05-07T11:00:00.00' },
      { utcTime: '2018-05-07T12:00:00.00' },
      { utcTime: '2018-05-07T13:00:00.00' },
      { utcTime: '2018-05-07T14:00:00.00' },
      { utcTime: '2018-05-07T15:00:00.00' },
      { utcTime: '2018-05-07T16:00:00.00' },
      { utcTime: '2018-05-07T17:00:00.00' },
      { utcTime: '2018-05-07T18:00:00.00' },
      { utcTime: '2018-05-07T19:00:00.00' },
      { utcTime: '2018-05-07T20:00:00.00' },
      { utcTime: '2018-05-07T21:00:00.00' },
      { utcTime: '2018-05-07T22:00:00.00' },
      { utcTime: '2018-05-07T23:00:00.00' },
      { utcTime: '2018-05-08T00:00:00.00' },
      { utcTime: '2018-05-08T01:00:00.00' },
      { utcTime: '2018-05-08T02:00:00.00' },
      { utcTime: '2018-05-08T03:00:00.00' },
      { utcTime: '2018-05-08T04:00:00.00' },
      { utcTime: '2018-05-08T05:00:00.00' },
      { utcTime: '2018-05-08T06:00:00.00' },
      { utcTime: '2018-05-08T07:00:00.00' },
      { utcTime: '2018-05-08T08:00:00.00' },
    ];

    const nextTwoPeriods = [{
      period: 'DAY',
      start: moment.utc('2018-05-07T07:00:00.00'),
    }, {
      period: 'NIGHT',
      start: moment.utc('2018-05-07T19:00:00.00'),
    }];

    const expected = [{
      period: 'DAY',
      forecast: [
        { utcTime: '2018-05-07T07:00:00.00' },
        { utcTime: '2018-05-07T08:00:00.00' },
        { utcTime: '2018-05-07T09:00:00.00' },
        { utcTime: '2018-05-07T10:00:00.00' },
        { utcTime: '2018-05-07T11:00:00.00' },
        { utcTime: '2018-05-07T12:00:00.00' },
        { utcTime: '2018-05-07T13:00:00.00' },
        { utcTime: '2018-05-07T14:00:00.00' },
        { utcTime: '2018-05-07T15:00:00.00' },
        { utcTime: '2018-05-07T16:00:00.00' },
        { utcTime: '2018-05-07T17:00:00.00' },
        { utcTime: '2018-05-07T18:00:00.00' },
      ],
    }, {
      period: 'NIGHT',
      forecast: [
        { utcTime: '2018-05-07T19:00:00.00' },
        { utcTime: '2018-05-07T20:00:00.00' },
        { utcTime: '2018-05-07T21:00:00.00' },
        { utcTime: '2018-05-07T22:00:00.00' },
        { utcTime: '2018-05-07T23:00:00.00' },
        { utcTime: '2018-05-08T00:00:00.00' },
        { utcTime: '2018-05-08T01:00:00.00' },
        { utcTime: '2018-05-08T02:00:00.00' },
        { utcTime: '2018-05-08T03:00:00.00' },
        { utcTime: '2018-05-08T04:00:00.00' },
        { utcTime: '2018-05-08T05:00:00.00' },
        { utcTime: '2018-05-08T06:00:00.00' },
      ],
    },
    ];

    const result = times.nextDayAndNightForecasts(forecast, nextTwoPeriods);
    assert.deepStrictEqual(result, expected);
  });
});
