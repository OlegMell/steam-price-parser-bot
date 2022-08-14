import { Telegraf, Scenes, session } from 'telegraf';

import startDBConnect from '../db/db.connect.js';
import { User } from '../db/models/user.model.js';
import { MESSAGES } from './messages.js';
import { mainKeyboard } from './keyboard.js';
import { startMainKeyboardListener } from './mainKeyboardListener.js';
import { setStageScenes } from './stage';



export default async function startParseBot(): Promise<Telegraf<Scenes.SceneContext>> {

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

    });

    startMainKeyboardListener(bot);

    return bot;
}

