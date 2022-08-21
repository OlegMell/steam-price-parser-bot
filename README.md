# steam-price-parser-bot
***
This Telegram Bot is built on Node.js with Telegraf.js and TypeScript with MongoDB.

The application can manage products for an individual user and parse the prices of these products from the site steamcommunity.com and then send them to the user at intervals.
Just add item by link and click button or wait for 6 hours interval for get prices automatically.

***

**`npm install`** - install dependencies

***

### Create .env file in the root directory with follow variables:

`BOT_TOKEN` Telegram Bot Token received from BotFather

`DB_URL` Database connection URL

`DB_NAME` Database name

`HEROKU_URL` URL for WebHook settings

`PORT` any

`NODE_ENV` development or production


***

**`npm run start`**  - start the app



