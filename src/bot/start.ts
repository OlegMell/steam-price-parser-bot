import { Telegraf, Scenes, session } from 'telegraf';

import startDBConnect from '../db/db.connect.js';

import { User } from '../db/models/user.model.js';
import { User as IUSer } from '../db/interfaces/user.interface';
import { MESSAGES } from './messages.js';
import { mainKeyboard } from './keyboard.js';
import { startMainKeyboardListener } from './mainKeyboardListener.js';

import { setStageScenes } from './stage';
import { UserModel } from '../db/db.config';
import { Item } from '../db/interfaces/item.interface';

import rp from 'request-promise';
import puppeteer from 'puppeteer/lib/cjs/puppeteer/puppeteer';
import { helpers } from '../helpers/helpers';


export default async function startParseBot() {

    await startDBConnect();

    let bot: Telegraf<Scenes.SceneContext>;

    bot = new Telegraf(process.env.BOT_TOKEN || '')

    const stage = setStageScenes();

    bot.use(session());
    bot.use(stage.middleware());

    bot.start(async (ctx: any) => {

        const user = await User.findOneBy({ chatId: ctx.chat.id });

        if (!user) {

            await User.create(ctx);

            await ctx.reply(MESSAGES.NEW_USER_DESCRIPTION, mainKeyboard);

        } else {
            await ctx.reply('Hi there!', mainKeyboard);
        }



        // setInterval(async () => {

            // await page.waitForSelector('span.market_commodity_orders_header_promote');
            //
            // const c =  await page.content();
            // const dom = new JSDOM(c);
            //
            // let price = dom.window.document.querySelectorAll('span.market_commodity_orders_header_promote')[1].textContent;

            // const currentPrice = getClearPrice(price);



        // }, 3000);



        setInterval(async () => {

            const browser = await puppeteer.launch();
            const page = await browser.newPage();

            const users: IUSer[] | null = await UserModel
                .find()
                .populate({
                    path: 'items',
                }).exec();

            if (users) {

                for (const user of users) {

                    if (!user.items && !user.items!.length) {
                        return;
                    }

                    for (const userItem of user.items!) {

                        await page.goto(userItem.link, { waitUntil: 'networkidle2' });

                        await page.waitForSelector('span.market_commodity_orders_header_promote');

                        const c =  await page.content();
                        const dom = new JSDOM(c);

                        let price = dom.window.document.querySelectorAll('span.market_commodity_orders_header_promote')[1].textContent;

                        price = helpers.getClearPrice(price);

                        await ctx.replyWithMarkdown(`*Найденная цена:* ${price}`);

                    }
                }

            }

            await browser.close();

        }, 8000);


    });

    startMainKeyboardListener(bot);

    return bot;
}

