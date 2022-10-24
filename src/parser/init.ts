import dotenv from 'dotenv';

dotenv.config();

import { Telegraf } from 'telegraf';

import { Intervals } from './configs';
import startDBConnect from '../db/db.connect';
import { PuppeteerHelper } from './helpers/PuppeteerHelper';
import { startParseSchedule } from './startParseSchedule';


(async () => {

    const bot = new Telegraf(process.env.BOT_TOKEN || '');

    await startDBConnect();

    const puppeteerHelper = new PuppeteerHelper();

    const intervalId = startParseSchedule(bot, puppeteerHelper, Intervals.HOUR3);

    process.once('SIGINT', () => {
        console.log('SIGINT');

        bot.stop('SIGINT');
        clearInterval(intervalId);
        puppeteerHelper.close();
    });

    process.once('SIGTERM', () => {
        console.log('SIGTERM');

        bot.stop('SIGTERM');
        clearInterval(intervalId);
        puppeteerHelper.close();
    });

})();
