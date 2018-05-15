const forecast = require('../src/fetch-forecast');
const times = require('../src/times');
const opinion = require('../src/create-opinion');
const twitter = require('../src/tweet');

const shouldTweet = process.env.NODE_ENV === 'production';

const go = async () => {
  const rawForecast = await forecast.forecast();
  const weather = rawForecast.metcheckData.forecastLocation.forecast;
  const periods = times.nextTwoPeriods();

  const tweet = await opinion.formTweet(weather, periods);

  if (shouldTweet) {
    twitter.tweet(tweet);
  } else {
    console.log('Tweet is');
    console.log(tweet);
  }
};

go();
