# clotheslinebot
Twitter bot to tell you whether it's a good idea to put your washing on the line. Follow at [@WashingLineLDN](https://twitter.com/WashingLineLDN)

## Why did you make this?
I live in a flat with a terrible washer-dryer, so I put up a clothes line in the garden. I normally work in the daytime and can hang clothes up before leaving the house, but because I live in England, it's difficult to tell if they're going to get soaked.

## Forecast data
The bot gets weather data from the metcheck.com API - see https://www.metcheck.com/OTHER/json_data.asp. It includes clothes drying times which are based on evapotranspiration.

It's designed to tweet twice a day. I'm interested to know how it performs in the real world, so if you follow the bot's advice and your clothes get soaked, please open an [issue](https://github.com/thedanwoods/clotheslinebot/issues).

## Fork your own
You should be able to make a clothesline bot for your own region by changing the variables in ``lib/config.js``. You'll need to make sure your server is running in the same timezone as the forecast region.

You'll need to create a new twitter account and then [create an application](https://apps.twitter.com/app/new) to get the credentials. Save them in the environment variables that ``lib/secrets.js`` refers to.

If you're interested in doing this, let me know and I can write up the full instructions.