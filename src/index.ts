import dotenv from 'dotenv';

dotenv.config();

import startParseBot from './bot/start.js';


startParseBot()
    .then((bot) => {

        const port = +process.env.PORT!;

        if (process.env.NODE_ENV === 'production') {

            // bot.launch({
            //     webhook: {
            //         domain: process.env.HEROKU_URL,
            //         port: port || 5000,
            //     }
            // });

        } else if (process.env.NODE_ENV === 'development') {
            bot.launch();
        }


        process.once('SIGINT', () => bot.stop('SIGINT'));
        process.once('SIGTERM', () => bot.stop('SIGTERM'));
    });
