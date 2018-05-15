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

const between = (times) => {
  const list = [...times];
  const last = list.pop();
  return `Only hang your clothes out between ${list.length === 0 ? last : `${list.join(', ')} and ${last}`}`;
};

const best = (time, duration) => `Drying time at ${time} is ${duration}`;

const dryOvernight = night => (night === 'TONIGHT' ?
  'No rain tonight.' : 'No rain overnight.');

const dampOvernight = () => 'Rather damp overnight.';

const rainOvernight = night => (night === 'TONIGHT' ?
  'Rain tonight.' : 'Rain overnight.');

const bestTime = (time, duration) =>
  `Drying time at ${time} is ${duration}.`;

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
