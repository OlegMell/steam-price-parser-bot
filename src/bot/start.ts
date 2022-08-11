import { Telegraf, Scenes, session } from 'telegraf';
import startDBConnect from '../db/db.connect.js';

import { SceneGenerator } from './scenes/SceneGenerator.js';
import { User } from '../db/models/user.model.js';
import { MESSAGES } from './messages.js';
import { mainKeyboard } from './keyboard.js';
import { startMainKeyboardListener } from './mainKeyboardListener.js';

const { Stage } = Scenes;

import express from 'express';


export default async function startParseBot() {

    await startDBConnect();

    let bot: any;

    if (process.env.NODE_ENV === 'production') {
        bot = new Telegraf(process.env.BOT_TOKEN || '')
        bot.webhookCallback(process.env.HEROKU_URL! + process.env.BOT_TOKEN!);
    } else {
        bot = new Telegraf(process.env.BOT_TOKEN || '');
    }

    const app = express();

    const port = process.env.PORT || 5000;

    app.use(express.json());

    app.get('/', (req: Request, res: any) => {
        console.log(req);
        res.status(200).json({ message: 'Hello from the Bot API.' });
    });
// TELEGRAM WEBHOOK - https://core.telegram.org/bots/api#setwebhook
    app.post(`/${process.env.BOT_TOKEN}`, (req: Request, res: any) => {
        res.json({ webhook: true });
        bot.processUpdate(req.body);
        res.status(200).json({ message: 'ok' });
    });

    app.listen(port, () => {
        console.log(`\n\nServer running on port ${port}.\n\n`);
    });

    const sceneGenerator = new SceneGenerator();

    const addItemNameScene = sceneGenerator.addItemNameScene();
    const addItemLinkScene = sceneGenerator.addItemLinkScene();
    const addItemPriceScene = sceneGenerator.addItemPriceScene();
    const addItemSelectorScene = sceneGenerator.addItemSelectorScene();
    const addItemConfirmScene = sceneGenerator.addItemConfirmScene();

    // @ts-ignore
    const stage = new Stage([addItemNameScene, addItemLinkScene, addItemPriceScene, addItemSelectorScene, addItemConfirmScene ]);

    bot.use(session());
    // @ts-ignore
    bot.use(stage.middleware());

    bot.webhookCallback(`${process.env.HEROKU_URL}${process.env.BOT_TOKEN}`);


    bot.start(async (ctx: any) => {

        const user = await User.findOneBy({ chatId: ctx.chat.id });

        // console.log(user);

        // console.log(mainKeyboard);

        if (!user) {

            const u = await User.create(ctx);

            console.log('CREATED_USER', u);

            await ctx.reply(MESSAGES.NEW_USER_DESCRIPTION, mainKeyboard);

        } else {
            await ctx.reply('Hi there!', mainKeyboard);
        }


    });

    startMainKeyboardListener(bot);

    bot.launch();
}

