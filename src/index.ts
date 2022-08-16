import dotenv from 'dotenv';

dotenv.config();

import startParseBot from './bot/start.js';


startParseBot()
    .then((bot) => {

        const port = +process.env.PORT!;

        // bot.launch({
        //     webhook: {
        //         domain: process.env.HEROKU_URL,
        //         port: port || 5000,
        //     }
        // });
        bot.launch()

        process.once('SIGINT', () => bot.stop('SIGINT'));
        process.once('SIGTERM', () => bot.stop('SIGTERM'));
    });
