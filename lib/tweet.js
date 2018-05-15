// sends a tweet
const secrets = require('./secrets.js');
const Twitter = require('twitter');

const tweet = (text) => {
  const client = new Twitter({
    consumer_key: secrets.CONSUMER_KEY,
    consumer_secret: secrets.CONSUMER_SECRET,
    access_token_key: secrets.ACCESS_TOKEN,
    access_token_secret: secrets.ACCESS_TOKEN_SECRET,
  });

  client.post('statuses/update', { status: text }, (error) => {
    if (error) {
      console.log(error);
      throw error;
    }
  });
};


module.exports = { tweet };
