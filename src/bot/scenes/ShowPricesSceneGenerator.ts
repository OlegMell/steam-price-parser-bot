import { Markup, Scenes } from 'telegraf';

import { mainKeyboard } from '../keyboard';
import { UserModel } from '../../db/db.config';
import { steamParser } from '../../parser/steam-parser';
import { User as IUSer } from '../../db/interfaces/user.interface';
import { PuppeteerHelper } from '../../parser/helpers/PuppeteerHelper';
import { ERRORS, COMMON_MESSAGES, SHOW_PRICE_SCENE_MESSAGES, BUTTON_TEXT, STOCK_SCENE_MESSAGES } from '../consts';


export class ShowPricesSceneGenerator {

    readonly #puppeteerHelper;

    constructor() {
        this.#puppeteerHelper = new PuppeteerHelper();
    }

    showPricesScene() {

        const showPrices = new Scenes.BaseScene<Scenes.SceneContext>('showPrices');

        showPrices.enter(async (ctx: any) => {

            await ctx.replyWithMarkdown(`*${ SHOW_PRICE_SCENE_MESSAGES.SHOW_PRICES }*`, Markup.keyboard([
                [ BUTTON_TEXT.RETURN ]
            ]).resize());

            const waitForSearchMsg = await ctx.replyWithMarkdown(`*${COMMON_MESSAGES.WAIT_FOR_SEARCHING}*`);

            await this.#puppeteerHelper.createBrowserPage();

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
                return await ctx.replyWithMarkdown(`*${STOCK_SCENE_MESSAGES.EMPTY_STOCK}*`)
            }

            await steamParser(ctx, user, this.#puppeteerHelper);

            await ctx.telegram.deleteMessage(ctx.chat.id, waitForSearchMsg.message_id);

            await this.#puppeteerHelper.close();

        });

        showPrices.hears(BUTTON_TEXT.RETURN, async (ctx: any) => {
            await ctx.telegram.deleteMessage(ctx.chat.id, ctx.message.message_id);
            await ctx.replyWithMarkdown(`*${SHOW_PRICE_SCENE_MESSAGES.U_LEAVE}*`, mainKeyboard);
            await ctx.scene.leave();
        });

        return showPrices;
    }

}
