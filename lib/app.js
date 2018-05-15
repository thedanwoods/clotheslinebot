const forecast = require('./fetch-forecast');
const times = require('./times');
const opinion = require('./create-opinion');
const twitter = require('./tweet');

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
