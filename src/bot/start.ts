import {Telegraf, Scenes, session} from 'telegraf';
import startDBConnect from '../db/db.connect.js';

import { SceneGenerator } from './scenes/SceneGenerator.js';
import { User } from '../db/models/user.model.js';
import { MESSAGES } from './messages.js';
import mainKeyboard from './keyboard.js';
import { startMainKeyboardListener } from './mainKeyboardListener.js';

const { Stage } = Scenes;


export default async function startParseBot() {

    await startDBConnect();

    const bot = new Telegraf(process.env.BOT_TOKEN || '');

    const sceneGenerator = new SceneGenerator();

    const addItemLinkScene = sceneGenerator.addItemLinkScene();
    const addItemPriceScene = sceneGenerator.addItemPriceScene();
    const addItemSelectorScene = sceneGenerator.addItemSelectorScene();

    // @ts-ignore
    const stage = new Stage([addItemLinkScene, addItemPriceScene, addItemSelectorScene]);

    bot.use(session());
    // @ts-ignore
    bot.use(stage.middleware());


    bot.start(async (ctx: any) => {

        const user = await User.findOneBy({chatId: ctx.chat.id});

        if (!user) {

            const u = await User.create(ctx);

            console.log('CREATED_USER', u);

            ctx.reply(MESSAGES.NEW_USER_DESCRIPTION, mainKeyboard);

        } else {
            ctx.reply('Hi there!', mainKeyboard);
        }


    });

    startMainKeyboardListener(bot);

    bot.launch();
}

