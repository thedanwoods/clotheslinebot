const forecast = require('./fetch-forecast');
const times = require('./times');
const opinion = require('./create-opinion');
const twitter = require('./tweet');

const shouldTweet = process.env.NODE_ENV === 'production';

const go = async () => {
  const rawForecast = await forecast.forecast();
  const weather = rawForecast.metcheckData.forecastLocation.forecast;
  const periods = times.nextTwoPeriods();
  console.log('Periods is');
  console.log(periods);

  const tweet = await opinion.formTweet(weather, periods);

  if (shouldTweet) {
    try {
      twitter.tweet(tweet);
    } catch (e) {
      console.log(e);
    }
  } else {
    console.log('Not tweeting live.');
    console.log('Tweet text is:');
    console.log(tweet);
  }
};

go();
