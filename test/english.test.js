/* eslint-env mocha */
const assert = require('assert');
const english = require('../src/english');

describe('wet', () => {
  it('should return the right text if it is wet', () => {
    const result = english.wetAllDay();
    assert.ok(result === 'It will be wet all day.');
  });
});

describe('between', () => {
  it('should return the right text if several drying times', () => {
    const three = [
      '10am - 12pm',
      '1pm - 3pm',
      '4pm - 6pm',
    ];
    const two = [
      '1pm - 3pm',
      '4pm - 6pm',
    ];
    const one = [
      '4pm - 6pm',
    ];
    const resultOne = english.between(one);
    assert.equal(resultOne, 'Only hang your clothes out between 4pm - 6pm');
    const resultTwo = english.between(two);
    assert.equal(resultTwo, 'Only hang your clothes out between 1pm - 3pm and 4pm - 6pm');
    const resultThree = english.between(three);
    assert.equal(
      resultThree,
      'Only hang your clothes out between 10am - 12pm, 1pm - 3pm and 4pm - 6pm',
    );
  });
});
