import { Telegraf } from 'telegraf';
import { JSDOM } from 'jsdom';
import puppeteer from 'puppeteer';

import { User as IUSer } from '../db/interfaces/user.interface';
import { UserModel } from '../db/db.config';
import { helpers } from '../helpers/helpers';
import startDBConnect from '../db/db.connect';


(async () => {

    const bot = new Telegraf(process.env.BOT_TOKEN || '');

    await startDBConnect();

    setInterval(async () => {

        const browser = await puppeteer.launch({
            headless: true,
            args: [ '--no-sandbox' ]
        });

        const page = await browser.newPage();

        const userR: IUSer[] | null = await UserModel
            .find()
            .populate({
                path: 'items',
            }).exec();

        if (userR) {

            for (const user of userR) {

                if (user && user.items && user.items!.length) {

                    for (const userItem of user.items!) {

                        await page.goto(userItem.link, { waitUntil: 'networkidle2' });

                        await page.waitForSelector(userItem.selectorHTML, {
                            timeout: 0
                        });

                        const c = await page.content();
                        const dom = new JSDOM(c);

                        let price = dom.window.document.querySelectorAll(userItem.selectorHTML)[1].textContent;

                        price = helpers.getClearPrice(price!);

                        await bot.telegram.sendMessage(user.chatId, `Товар: ${userItem.name}\nНАЧАЛЬНАЯ ЦЕНА $${userItem.initialPrice}\nНОВАЯ ЦЕНА: $${ price }`);
                    }
                }
            }
        }

        await browser.close();

    }, 180 * 60000);
})()

// 360 * 60000 = 6 hours
