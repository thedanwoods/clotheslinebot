const times = require('./times.js');

const wetAllDay = () => 'It will be wet all day.';
const dryAllDay = () => 'Dry all day.';
const mainlyDry = () => 'Mainly dry.';
const someRain = () => 'Some rain.';
const goodDay = () => 'Hang your clothes out!';
const badDay = () => 'Don\'t hang your clothes out.';
const until = time => `Only hang your clothes up until ${time}.`;
const after = time => (`Only hang your clothes up after ${time}.`);
const tooSlow = () => 'They will dry too slowly.';
const windy = () => 'Windy. Use strong pegs!';

const between = (periods) => {
  const list = [...periods];
  const last = list.pop();
  return `Only hang your clothes out between ${list.length === 0 ? last : `${list.join(', ')} and ${last}`}`;
};

const best = (time, duration) => `Drying time at ${time} is ${duration}`;

const dryOvernight = night => (night === 'TONIGHT' ?
  'No rain tonight.' : 'No rain overnight.');

const dampOvernight = () => 'Rather damp overnight.';

const rainOvernight = night => (night === 'TONIGHT' ?
  'Rain tonight.' : 'Rain overnight.');

const bestTime = (time, duration) => {
  // Short drying times from Metcheck seem to be unreliable, so don't give exact figure
  const durText = times.convertDataTimeToMinutes(duration) < 30 ?
    'less than half an hour' : duration;
  return `Drying time at ${time} is ${durText}.`;
};

module.exports = {
  wetAllDay,
  dryAllDay,
  mainlyDry,
  someRain,
  goodDay,
  badDay,
  until,
  after,
  between,
  tooSlow,
  windy,
  best,
  dryOvernight,
  dampOvernight,
  rainOvernight,
  bestTime,
};
