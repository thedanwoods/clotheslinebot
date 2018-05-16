const moment = require('moment');

// Converts duration string to number of minutes, e.g."1h 20m" to 80
const convertDataTimeToMinutes = (t) => {
  const spl = (t.split(' '));
  const hrs = +(spl[0].split('h')[0]);
  const mins = +(spl[1].split('m')[0]);
  return mins + (hrs * 60);
};

// Returns whether it is day or night now, as string
const dayOrNight = () => {
  const hour = moment().hour();
  return hour >= 17 || hour < 7 ? 'NIGHT' : 'DAY';
};

// Returns moment object representing the next time it's 7am
const nextDayStart = () => {
  const now = moment();
  const hour = now.hour();
  // If before 7am, today 7am
  // if after 7am, tomorrow 7am
  if (hour < 7) {
    now.hours(7).minutes(0).seconds(0).milliseconds(0);
  } else {
    now.add(1, 'days').hours(7).minutes(0).seconds(0)
      .milliseconds(0);
  }
  return now;
};

// Returns moment object representing the next time it's 7pm
const nextNightStart = () => {
  const now = moment();
  const hour = now.hour();
  // If before 7pm, today 7pm
  // if after 7pm, tomorrow 7pm
  if (hour < 19) {
    now.hours(19).minutes(0).seconds(0).milliseconds(0);
  } else {
    now.add(1, 'days').hours(19).minutes(0).seconds(0)
      .milliseconds(0);
  }
  return now;
};

// Returns object representing the next day and the next night,
// or the next night and the next day, depnding on the time now
const nextTwoPeriods = () => {
  const dayNight = dayOrNight();
  if (dayNight === 'DAY') {
    return [{ period: 'NIGHT', start: nextNightStart() },
      { period: 'DAY', start: nextDayStart() }];
  }
  return [{ period: 'DAY', start: nextDayStart() },
    { period: 'NIGHT', start: nextNightStart() }];
};

/* Accepts a forecast and array of periods, and
returns an array of forecasts that fit the periods */
const nextDayAndNightForecasts = (forecast, nextPeriods) =>
  nextPeriods.map(period => ({
    period: period.period,
    forecast: forecast.filter(el =>
      moment.utc(el.utcTime).isSameOrAfter(period.start) &&
      moment.utc(el.utcTime).isBefore(period.start.clone().add(12, 'h'))),
  }));


module.exports = {
  dayOrNight,
  convertDataTimeToMinutes,
  nextDayAndNightForecasts,
  nextTwoPeriods,
};
