const moment = require('moment');
const times = require('./times.js');
const language = require('./english.js');

const RAIN_THRESHOLD = 0.1;
const WINDY_THRESHOLD = 20;

// Return array indicating whether each (hourly) timeslot is dry or wet
const dryTimes = forecast => forecast.map(el => ({
  time: el.utcTime,
  rain: el.rain,
  weather: +el.rain <= RAIN_THRESHOLD ? 'DRY' : 'WET',
  dryingTimeHeavy: el.dryingTimeHeavy,
}));

/*
Return array of objects representing spells when it's dry enough
to hang out your washing
*/
const getDrySpells = (hours) => {
  let currentWeather = 'WET';
  let spells = [];
  let minDryingTime = { duration: '23hrs 59min' };
  hours.forEach((el) => {
    if (el.weather === 'DRY' && currentWeather === 'WET') {
      // New dry spell
      currentWeather = 'DRY';
      spells.push({
        start: el.time,
        dryingTimeHeavy: el.dryingTimeHeavy,
      });
    }
    if (el.weather === 'WET' && currentWeather === 'DRY') {
      // End of dry spell
      currentWeather = 'WET';
      spells[spells.length - 1].end = el.time;
      spells[spells.length - 1].minDryingTime = minDryingTime;
      minDryingTime = { duration: '23hrs 59min' };
    }
    // Keep track of shortest drying time in period
    const dryingTime = times.convertDataTimeToMinutes(el.dryingTimeHeavy);
    if (dryingTime < times.convertDataTimeToMinutes(minDryingTime.duration)) {
      minDryingTime = {
        duration: el.dryingTimeHeavy,
        time: el.time,
      };
    }
  });
  // Finally, finish the last dry spell
  if (currentWeather === 'DRY' && spells.length) {
    spells[spells.length - 1].end = hours[hours.length - 1].time;
    spells[spells.length - 1].minDryingTime =
      spells[spells.length - 1].minDryingTime || minDryingTime;
  }
  // Remove any dry spells that are shorter than the drying time,
  // as not long enough for your clothes to dry before getting wet again
  spells = spells.filter(el =>
    moment.utc(el.end).diff(moment.utc(el.start), 'minutes') >
    times.convertDataTimeToMinutes(el.dryingTimeHeavy));
  return spells;
};

// Return true if no rain in forecast
const allDry = forecast => forecast.reduce((acc, cur) =>
  (cur.rain >= RAIN_THRESHOLD ? false : acc), true);

// Return true if fewer than 3 rainy periods
const mainlyDry = (forecast) => {
  const rainHours = forecast.filter(f => +f.rain > RAIN_THRESHOLD);
  return rainHours.length < 3 && rainHours.length > 0;
};

// Return string telling us the best drying time
const bestDryingTime = (forecast) => {
  const drySpells = getDrySpells(dryTimes(forecast));
  const best = drySpells.reduce((acc, cur) => {
    const dur = times.convertDataTimeToMinutes(cur.minDryingTime.duration);
    const min = times.convertDataTimeToMinutes(acc.duration);
    if (dur < min) return cur.minDryingTime;
    return acc;
  }, { duration: '23hr 59min', time: '' });
  return language.bestTime(moment.utc(best.time).local().format('ha'), best.duration);
};

const strongestWind = forecast =>
  forecast.reduce((acc, cur) =>
    (+cur.windspeed > acc ? +cur.windspeed : acc), 0);

const onlyAfter = (forecast) => {
  const spells = getDrySpells(dryTimes(forecast));
  if (spells.length !== 1
      || forecast[forecast.length - 1].utcTime !== spells[0].end
      || forecast[0].utcTime === spells[0].start) {
    return false;
  }
  const fromTime = moment.utc(spells[0].start).local().format('ha');
  return fromTime;
};

const onlyBefore = (forecast) => {
  const spells = getDrySpells(dryTimes(forecast));
  if (spells.length !== 1
    || forecast[0].utcTime !== spells[0].start
    || forecast[forecast.length - 1].utcTime === spells[0].end) {
    return false;
  }
  const toTime = moment.utc(spells[0].end).local().format('ha');
  return toTime;
};

const onlyBetween = (forecast) => {
  const spells = getDrySpells(dryTimes(forecast));
  if (spells.length < 1
    || (spells.length === 1 && (
      forecast[0].utcTime === spells[0].start
    || forecast[forecast.length - 1].utcTime === spells[0].end))) {
    return false;
  }
  const drySpellsText = spells.map(sp => `${moment.utc(sp.start).local().format('ha')}-${
    moment.utc(sp.end).local().format('ha')}`);
  drySpellsText[drySpellsText.length - 1] = `${drySpellsText[drySpellsText.length - 1]}.`;
  return drySpellsText;
};

const formTweet = async (forecast, nextTwoPeriods) => {
  let tweet = [];
  const nextForecasts = times.nextDayAndNightForecasts(forecast, nextTwoPeriods);
  const nextDayForecast = nextForecasts.filter(el => el.period === 'DAY')[0].forecast;
  const nextNightForecast = nextForecasts.filter(el => el.period === 'NIGHT')[0].forecast;
  const nextTwoForecasts = [...nextDayForecast, ...nextNightForecast];


  // Dry all day?
  if (allDry(nextDayForecast)) {
    tweet.push(language.goodDay());
    tweet.push(language.dryAllDay());
    tweet.push(bestDryingTime(nextDayForecast));
  }

  // Mainly dry?
  if (mainlyDry(nextDayForecast)) {
    tweet.push(language.mainlyDry());
  }

  // Only dry after a particular time?
  if (onlyAfter(nextDayForecast)) {
    tweet.push(language.after(onlyAfter(nextDayForecast)));
    tweet.push(bestDryingTime(nextDayForecast));
  }

  // Only dry before a particular time?
  if (onlyBefore(nextDayForecast)) {
    tweet.push(language.until(onlyBefore(nextDayForecast)));
    tweet.push(bestDryingTime(nextDayForecast));
  }

  // Dry spell or spells?
  if (onlyBetween(nextDayForecast)) {
    tweet.push(language.between(onlyBetween(nextDayForecast)));
    tweet.push(bestDryingTime(nextDayForecast));
  }

  // Wet?
  if (getDrySpells(dryTimes(nextDayForecast)).length === 0) {
    tweet.push(language.badDay());
    tweet.push(language.wetAllDay());
  }

  // Dry overnight?
  switch (nextForecasts[0].period) {
    case 'DAY':
      tweet.push(allDry(nextNightForecast) ?
        language.dryOvernight('TONIGHT') :
        language.rainOvernight('TONIGHT'));
      break;
    case 'NIGHT': {
      const s = tweet[0];
      tweet[0] = `${s.slice(0, s.length - 1)} tomorrow${s.slice(-1)}`;
      tweet.unshift(allDry(nextNightForecast) ?
        language.dryOvernight('OVERNIGHT') :
        language.rainOvernight('OVERNIGHT'));
      break;
    }
    default:
  }

  // Strong wind?
  if (strongestWind(nextTwoForecasts) > WINDY_THRESHOLD) {
    tweet.push(language.windy());
  }

  tweet = tweet.join(' ');
  // Remove full stop from end of tweet, to make it idiomatic
  tweet = tweet.replace(/\.$/, '');
  return tweet;
};


module.exports = {
  dryTimes, getDrySpells, formTweet, allDry, bestDryingTime,
};
