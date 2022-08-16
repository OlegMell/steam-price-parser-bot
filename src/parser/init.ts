import { Telegraf } from 'telegraf';

import startDBConnect from '../db/db.connect';
import { PuppeteerHelper } from './helpers/PuppeteerHelper';
import { startParseSchedule } from './startParseSchedule';
import { Intervals } from './configs';


(async () => {

    const bot = new Telegraf(process.env.BOT_TOKEN || '');

    await startDBConnect();

    const puppeteerHelper = new PuppeteerHelper();

    const intervalId = startParseSchedule(bot, puppeteerHelper, Intervals.HOUR6);

    process.once('SIGINT', () => {
        bot.stop('SIGINT');
        clearInterval(intervalId);
        puppeteerHelper.close();
    });

    process.once('SIGTERM', () => {
        bot.stop('SIGTERM');
        clearInterval(intervalId);
        puppeteerHelper.close();
    });

})();
