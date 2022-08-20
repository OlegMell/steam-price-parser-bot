import { Markup, Scenes } from 'telegraf';

import { ERRORS, MESSAGES } from '../messages';
import { mainKeyboard } from '../keyboard';
import { steamParser } from '../../parser/steam-parser';
import { PuppeteerHelper } from '../../parser/helpers/PuppeteerHelper';
import { User as IUSer } from '../../db/interfaces/user.interface';
import { UserModel } from '../../db/db.config';

export class ShowPricesSceneGenerator {

    showPricesScene() {

        const showPrices = new Scenes.BaseScene<Scenes.SceneContext>('showPrices');

        showPrices.enter(async (ctx: any) => {

            await ctx.replyWithMarkdown(`*${ MESSAGES.SHOW_PRICES }*`, Markup.keyboard([
                [ 'Назад' ]
            ]).resize());

            const waitForSearchMsg = await ctx.replyWithMarkdown(`*${MESSAGES.WAIT_FOR_SEARCHING}*`);

            const puppeteerHelper = new PuppeteerHelper();

            await puppeteerHelper.createBrowserPage();

            const user: IUSer | null = await UserModel
                .findOne({ chatId: ctx.chat.id })
                .populate({
                    path: 'items',
                }).exec();

            if (!user) {
                await ctx.telegram.deleteMessage(ctx.chat.id, waitForSearchMsg.message_id);
                return await ctx.replyWithMarkdown(`*${ERRORS.USER_NOT_FOUND}*`);
            } else if (user && (!user.items || !user.items.length)) {
                await ctx.telegram.deleteMessage(ctx.chat.id, waitForSearchMsg.message_id);
                return await ctx.replyWithMarkdown(`*${MESSAGES.EMPTY_STOCK}*`)
            }

            await steamParser(ctx, user, puppeteerHelper);

            await ctx.telegram.deleteMessage(ctx.chat.id, waitForSearchMsg.message_id);

        });

        showPrices.hears('Назад', async (ctx: any) => {
            await ctx.telegram.deleteMessage(ctx.chat.id, ctx.message.message_id);
            await ctx.replyWithMarkdown('*ВЫ ВЫШЛИ ИЗ ПРОСМОТРА ЦЕН*', mainKeyboard);
            await ctx.scene.leave();
        });

        return showPrices;
    }

}
