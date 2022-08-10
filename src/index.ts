import dotenv from 'dotenv';

dotenv.config();

import startParseBot from './bot/start.js';

(async () => {
    return await startParseBot();
})()
    .then(() => {
        console.log('App started');
    })
    .catch((err) => {
        console.log(err);
    });

