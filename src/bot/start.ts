import { Telegraf, Scenes, session } from 'telegraf';
import startDBConnect from '../db/db.connect.js';

import { SceneGenerator } from './scenes/SceneGenerator.js';
import { User } from '../db/models/user.model.js';
import { MESSAGES } from './messages.js';
import { mainKeyboard } from './keyboard.js';
import { startMainKeyboardListener } from './mainKeyboardListener.js';

const { Stage } = Scenes;


export default async function startParseBot() {

    await startDBConnect();

    let bot;

    if (process.env.NODE_ENV === 'production') {
        bot = new Telegraf(process.env.BOT_TOKEN || '')
        bot.webhookCallback(process.env.HEROKU_URL! + process.env.BOT_TOKEN!);
    } else {
        bot = new Telegraf(process.env.BOT_TOKEN || '');
    }

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

