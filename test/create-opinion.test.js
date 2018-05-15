/* eslint-env mocha */
const assert = require('assert');
const moment = require('moment');

const opinion = require('../src/create-opinion');
const testForecastJson = require('./test-forecast.json');

const testForecast = testForecastJson.metcheckData.forecastLocation.forecast;

describe('dry spells', () => {
  it('should return the correct dry spells', () => {
    const forecast = [{
      utcTime: '2018-05-07T10:00:00.00',
      rain: '0.00',
      dryingTimeHeavy: '0hrs 21min',
    },
    {
      utcTime: '2018-05-07T11:00:00.00',
      rain: '1.00',
      dryingTimeHeavy: '2hrs 22min',
    },
    {
      utcTime: '2018-05-07T12:00:00.00',
      rain: '0.00',
      dryingTimeHeavy: '2hrs 23min',
    },
    {
      utcTime: '2018-05-07T13:00:00.00',
      rain: '0.00',
      dryingTimeHeavy: '2hrs 20min',
    },
    {
      utcTime: '2018-05-07T14:00:00.00',
      rain: '0.00',
      dryingTimeHeavy: '2hrs 25min',
    },
    {
      utcTime: '2018-05-07T15:00:00.00',
      rain: '1.00',
      dryingTimeHeavy: '2hrs 26min',
    }];

    const expected = [
      {
        start: '2018-05-07T10:00:00.00',
        end: '2018-05-07T11:00:00.00',
        dryingTimeHeavy: '0hrs 21min',
        minDryingTime: {
          duration: '0hrs 21min',
          time: '2018-05-07T10:00:00.00',
        },
      },
      {
        start: '2018-05-07T12:00:00.00',
        end: '2018-05-07T15:00:00.00',
        dryingTimeHeavy: '2hrs 23min',
        minDryingTime: {
          duration: '2hrs 20min',
          time: '2018-05-07T13:00:00.00',
        },
      },
    ];

    const dryHours = opinion.dryTimes(forecast);
    const result = opinion.getDrySpells(dryHours);
    assert.deepStrictEqual(result, expected);
  });

  it('should work if it is raining first and not last', () => {
    const forecast = [{
      utcTime: '2018-05-07T10:00:00.00',
      rain: '2.00',
      dryingTimeHeavy: '2hrs 21min',
    },
    {
      utcTime: '2018-05-07T11:00:00.00',
      rain: '1.00',
      dryingTimeHeavy: '2hrs 22min',
    },
    {
      utcTime: '2018-05-07T12:00:00.00',
      rain: '0.00',
      dryingTimeHeavy: '2hrs 23min',
    },
    {
      utcTime: '2018-05-07T13:00:00.00',
      rain: '0.00',
      dryingTimeHeavy: '2hrs 24min',
    },
    {
      utcTime: '2018-05-07T14:00:00.00',
      rain: '0.00',
      dryingTimeHeavy: '2hrs 25min',
    },
    {
      utcTime: '2018-05-07T15:00:00.00',
      rain: '0.00',
      dryingTimeHeavy: '2hrs 26min',
    }];

    const expected = [
      {
        start: '2018-05-07T12:00:00.00',
        end: '2018-05-07T15:00:00.00',
        dryingTimeHeavy: '2hrs 23min',
        minDryingTime: {
          duration: '2hrs 21min',
          time: '2018-05-07T10:00:00.00',
        },
      },
    ];

    const dryHours = opinion.dryTimes(forecast);
    const result = opinion.getDrySpells(dryHours);
    assert.deepStrictEqual(result, expected);
  });

  it('should work if it is completely dry', () => {
    const forecast = [{
      utcTime: '2018-05-07T10:00:00.00',
      rain: '0.00',
      dryingTimeHeavy: '2hrs 21min',
    },
    {
      utcTime: '2018-05-07T11:00:00.00',
      rain: '0.01',
      dryingTimeHeavy: '2hrs 22min',
    },
    {
      utcTime: '2018-05-07T12:00:00.00',
      rain: '0.00',
      dryingTimeHeavy: '2hrs 23min',
    },
    {
      utcTime: '2018-05-07T13:00:00.00',
      rain: '0.00',
      dryingTimeHeavy: '2hrs 24min',
    },
    {
      utcTime: '2018-05-07T14:00:00.00',
      rain: '0.00',
      dryingTimeHeavy: '2hrs 25min',
    },
    {
      utcTime: '2018-05-07T15:00:00.00',
      rain: '0.00',
      dryingTimeHeavy: '2hrs 26min',
    }];

    const expected = [
      {
        start: '2018-05-07T10:00:00.00',
        end: '2018-05-07T15:00:00.00',
        dryingTimeHeavy: '2hrs 21min',
        minDryingTime: {
          duration: '2hrs 21min',
          time: '2018-05-07T10:00:00.00',
        },
      },
    ];

    const dryHours = opinion.dryTimes(forecast);
    const result = opinion.getDrySpells(dryHours);
    assert.deepStrictEqual(result, expected);
  });

  it('should return empty array if it is completely wet', () => {
    const forecast = [{
      utcTime: '2018-05-07T10:00:00.00',
      rain: '1.00',
      dryingTimeHeavy: '2hrs 21min',
    },
    {
      utcTime: '2018-05-07T11:00:00.00',
      rain: '1.01',
      dryingTimeHeavy: '2hrs 22min',
    },
    {
      utcTime: '2018-05-07T12:00:00.00',
      rain: '1.00',
      dryingTimeHeavy: '2hrs 23min',
    },
    {
      utcTime: '2018-05-07T13:00:00.00',
      rain: '1.00',
      dryingTimeHeavy: '2hrs 24min',
    },
    {
      utcTime: '2018-05-07T14:00:00.00',
      rain: '1.00',
      dryingTimeHeavy: '2hrs 25min',
    },
    {
      utcTime: '2018-05-07T15:00:00.00',
      rain: '1.00',
      dryingTimeHeavy: '2hrs 26min',
    }];

    const expected = [];

    const dryHours = opinion.dryTimes(forecast);
    const result = opinion.getDrySpells(dryHours);
    assert.deepStrictEqual(result, expected);
  });

  it('should remove dry spells that are shorter than the drying time', () => {
    const forecast = [{
      utcTime: '2018-05-07T10:00:00.00',
      rain: '1.00',
      dryingTimeHeavy: '2hrs 21min',
    },
    {
      utcTime: '2018-05-07T11:00:00.00',
      rain: '0.00',
      dryingTimeHeavy: '2hrs 22min',
    },
    {
      utcTime: '2018-05-07T12:00:00.00',
      rain: '1.00',
      dryingTimeHeavy: '2hrs 23min',
    },
    {
      utcTime: '2018-05-07T13:00:00.00',
      rain: '0.00',
      dryingTimeHeavy: '2hrs 24min',
    },
    {
      utcTime: '2018-05-07T14:00:00.00',
      rain: '0.00',
      dryingTimeHeavy: '2hrs 25min',
    },
    {
      utcTime: '2018-05-07T15:00:00.00',
      rain: '0.00',
      dryingTimeHeavy: '2hrs 26min',
    }];

    const expected = [];

    const dryHours = opinion.dryTimes(forecast);
    const result = opinion.getDrySpells(dryHours);
    assert.deepStrictEqual(result, expected);
  });


  describe('All Dry', () => {
    it('should return true if all dry', () => {
      const dryForecast = testForecast.slice(10, 15);
      const result = opinion.allDry(dryForecast);
      assert.strictEqual(result, true);
    });
    it('should return false if contains rainy spell', () => {
      const wetForecast = testForecast.slice(116, 124);
      const result = opinion.allDry(wetForecast);
      assert.strictEqual(result, false);
    });
  });

  describe('Best drying time', () => {
    it('should return correct text for best drying time', async () => {
      const result = opinion.bestDryingTime(testForecast);
      assert.strictEqual(result, 'Drying time at 2pm is 0hr 38min.'); // Test passes when UK BST only
    });
  });

  describe('dry tweet', () => {
    it('should return the right tweet for dry weather', async () => {
      const periods = [{
        period: 'DAY',
        start: moment.utc('2018-05-13T07:00:00.00'),
      }, {
        period: 'NIGHT',
        start: moment.utc('2018-05-13T19:00:00.00'),
      }];

      const result = await opinion.formTweet(testForecast, periods);
      const expected = 'Hang your clothes out! Dry all day. Drying time at 3pm is 0hr 52min. No rain tonight';
      assert.strictEqual(result, expected);
    });
  });

  describe('Only hang out after tweet', () => {
    it('should return the right tweet if it is raining until after a particular time', async () => {
      const periods = [{
        period: 'DAY',
        start: moment.utc('2018-05-14T07:00:00.00'),
      }, {
        period: 'NIGHT',
        start: moment.utc('2018-05-14T19:00:00.00'),
      }];
      const result = await opinion.formTweet(testForecast, periods);
      const expected = 'Mainly dry. Only hang your clothes up after 11am. Drying time at 2pm is 0hr 38min. No rain tonight';
      assert.strictEqual(result, expected);
    });
  });

  describe('Overninght rain tweet', () => {
    it('should return the right tweet if it rains overnight', async () => {
      const periods = [{
        period: 'DAY',
        start: moment.utc('2018-05-15T07:00:00.00'),
      }, {
        period: 'NIGHT',
        start: moment.utc('2018-05-15T19:00:00.00'),
      }];
      const result = await opinion.formTweet(testForecast, periods);
      const expected = 'Hang your clothes out! Dry all day. Drying time at 3pm is 1hr 19min. Rain tonight';
      assert.strictEqual(result, expected);
    });
  });

  describe('between tweet', () => {
    it('should return the right tweet if there are spells of good weather', async () => {
      const periods = [{
        period: 'DAY',
        start: moment.utc('2018-05-16T07:00:00.00'),
      }, {
        period: 'NIGHT',
        start: moment.utc('2018-05-16T19:00:00.00'),
      }];
      const result = await opinion.formTweet(testForecast, periods);
      const expected = 'Only hang your clothes out between 10am-2pm and 3pm-6pm. Drying time at 4pm is 1hr 54min. No rain tonight';
      assert.strictEqual(result, expected);
    });
  });

  describe('wet tweet', () => {
    it('should return the right tweet if it is wet', async () => {
      const periods = [{
        period: 'DAY',
        start: moment.utc('2018-05-17T07:00:00.00'),
      }, {
        period: 'NIGHT',
        start: moment.utc('2018-05-17T19:00:00.00'),
      }];
      const result = await opinion.formTweet(testForecast, periods);
      const expected = 'Don\'t hang your clothes out. It will be wet all day. No rain tonight';
      assert.strictEqual(result, expected);
    });
  });

  describe('Evening tweet', () => {
    it('should return tweet with the right order and grammar', async () => {
      const periods = [{
        period: 'NIGHT',
        start: moment.utc('2018-05-13T19:00:00.00'),
      }, {
        period: 'DAY',
        start: moment.utc('2018-05-14T07:00:00.00'),
      }];

      const result = await opinion.formTweet(testForecast, periods);
      const expected = 'No rain overnight. Mainly dry tomorrow. Only hang your clothes up after 11am. Drying time at 2pm is 0hr 38min';
      assert.strictEqual(result, expected);
    });
  });
});

