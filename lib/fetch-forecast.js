// Fetch and return a weather forcast
const fetch = require('node-fetch');

const config = require('./config.js');

const forecast = async () => {
  const { lat, long, id } = config.location;
  const url = 'http://ws1.metcheck.com/ENGINE/v9_0/json.asp?' +
    `lat=${lat}&lon=${long}&lid=${id}&Fc=Cd`;

  try {
    const res = await fetch(url);
    const json = await res.json();
    return json;
  } catch (e) {
    console.log(e);
    return {};
  }
};

// Get tonight's forecast
// nextPeriod returns


module.exports = { forecast };

