import { Telegraf } from 'telegraf';

import { Intervals } from './configs';
import { UserModel } from '../db/db.config';
import { helpers } from '../helpers/helpers';
import startDBConnect from '../db/db.connect';
import { User as IUSer } from '../db/interfaces/user.interface';
import { createNotFoundPriceMessage, createPriceMessage } from '../bot/messages';

import { PuppeteerHelper } from './PuppeteerHelper';
import { DOMHelper } from './DOMHelper';


(async () => {

    const bot = new Telegraf(process.env.BOT_TOKEN || '');

    await startDBConnect();

    const sendMessage = (chatId: string | number, msg: string) => {
        return bot.telegram.sendMessage(chatId, msg);
    }

    const getUsersPopulate = (): Promise<IUSer[] | null> => {
        return UserModel
            .find()
            .populate({
                path: 'items',
            }).exec();
    };

    const puppeteerHelper = new PuppeteerHelper();

    await puppeteerHelper.createBrowserPage();

    const intervalId = setInterval(async () => {

        // const browser = await puppeteer.launch({
        //     headless: true,
        //     args: [ '--no-sandbox' ]
        // });
        //
        // const page = await browser.newPage();


        const users: IUSer[] | null = await getUsersPopulate();

        if (users && users.length) {

            for (const user of users) {

                if (user && user.items && user.items.length) {

                    for (const userItem of user.items) {

                        // await page.goto(userItem.link, { waitUntil: 'networkidle2' });
                        await puppeteerHelper.goTo(userItem.link);

                        // await page.waitForSelector(userItem.selectorHTML, {
                        //     timeout: 0
                        // });

                        // await puppeteerHelper.waitForSelector(userItem.selectorHTML);

                        const pageContent: string = await puppeteerHelper.getPageContent(userItem.selectorHTML);

                        // const dom: JSDOM = new JSDOM(pageContent);

                        const domHelper: DOMHelper = new DOMHelper(pageContent);

                        let price: string | null = domHelper.getTextFrom(userItem.selectorHTML);

                        if (price) {
                            price = helpers.getClearPrice(price!);
                            await sendMessage(user.chatId, createPriceMessage(userItem, price));
                            // await bot.telegram.sendMessage(user.chatId, createPriceMessage(userItem, price));

                        } else {
                            await sendMessage(user.chatId, createNotFoundPriceMessage(userItem));
                            // await bot.telegram.sendMessage(user.chatId, createNotFoundPriceMessage(userItem));
                        }


                    }
                }
            }
        }

        await puppeteerHelper.close();

    }, Intervals.MINUTE * 2);

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
