/* eslint-env mocha */
const assert = require('assert');

const forecast = require('../src/fetch-forecast');

describe('metcheck', () => {
  it('should return an object with property ["metcheckData.forecastLocation.forecast"]', async () => {
    const result = await forecast.forecast();
    assert.ok(typeof result.metcheckData.forecastLocation.forecast === 'object');
  });
});
