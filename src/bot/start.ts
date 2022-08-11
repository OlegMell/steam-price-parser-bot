import { Telegraf, Scenes, session } from 'telegraf';
import startDBConnect from '../db/db.connect.js';

import { AddItemSceneGenerator } from './scenes/AddItemSceneGenerator';
import { User } from '../db/models/user.model.js';
import { MESSAGES } from './messages.js';
import { mainKeyboard } from './keyboard.js';
import { startMainKeyboardListener } from './mainKeyboardListener.js';

const { Stage } = Scenes;

import express from 'express';
import { StockSceneGenerator } from './scenes/StockSceneGenerator';


export default async function startParseBot() {

    await startDBConnect();

    let bot: Telegraf<Scenes.SceneContext>;

    bot = new Telegraf(process.env.BOT_TOKEN || '')

    const app = express();

    const port = process.env.PORT || 5000;

    app.use(express.json());

    const secretPath = `/telegraf/${bot.secretPathComponent()}`;

    app.get('/', (req: Request, res: any) => {
        console.log(req);
        res.status(200).json({ message: 'Hello from the Bot API.' });
    });
// TELEGRAM WEBHOOK - https://core.telegram.org/bots/api#setwebhook
//     app.post(`/${ process.env.BOT_TOKEN }`, (req: Request, res: any) => {
//         bot.processUpdate(req.body);
//         res.status(200).json({ message: 'ok' });
//     });

    if (process.env.NODE_ENV === 'production') {
        console.log('here');
        await bot.telegram.setWebhook(process.env.HEROKU_URL! + secretPath);

        app.use(bot.webhookCallback(secretPath));
    }

    app.listen(port, () => {
        console.log(`\n\nServer running on port ${ port }.\n\n`);
    });

    const addItemSceneGenerator = new AddItemSceneGenerator();
    const stockSceneGenerator = new StockSceneGenerator();

    const addItemNameScene = addItemSceneGenerator.addItemNameScene();
    const addItemLinkScene = addItemSceneGenerator.addItemLinkScene();
    const addItemPriceScene = addItemSceneGenerator.addItemPriceScene();
    const addItemSelectorScene = addItemSceneGenerator.addItemSelectorScene();
    const addItemConfirmScene = addItemSceneGenerator.addItemConfirmScene();

    const stockScene = stockSceneGenerator.showStockScene();


    const stage = new Stage<Scenes.SceneContext>([
        addItemNameScene,
        addItemLinkScene,
        addItemPriceScene,
        addItemSelectorScene,
        addItemConfirmScene,

        stockScene,
    ]);

    bot.use(session());
    bot.use(stage.middleware());

    bot.webhookCallback(`${ process.env.HEROKU_URL }${ process.env.BOT_TOKEN }`);


    bot.start(async (ctx: any) => {

        const user = await User.findOneBy({ chatId: ctx.chat.id });

        if (!user) {

            await User.create(ctx);

            await ctx.reply(MESSAGES.NEW_USER_DESCRIPTION, mainKeyboard);

        } else {
            await ctx.reply('Hi there!', mainKeyboard);
        }


    });

    startMainKeyboardListener(bot);

    bot.launch();

    // Enable graceful stop
    process.once('SIGINT', () => bot.stop('SIGINT'));
    process.once('SIGTERM', () => bot.stop('SIGTERM'));
}

