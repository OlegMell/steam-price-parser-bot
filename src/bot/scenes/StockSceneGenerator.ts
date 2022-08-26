import { Markup, Scenes } from 'telegraf';

import { ItemModel, UserModel } from '../../db/db.config';
import { User } from '../../db/interfaces/user.interface';
import { Item } from '../../db/interfaces/item.interface';
import { createURLButton, mainKeyboard } from '../keyboard';
import {
    createItemStockMsg,
    deleteItemMessage,
    ERRORS,
    COMMON_MESSAGES,
    BUTTON_TEXT,
    STOCK_SCENE_MESSAGES
} from '../consts';


export class StockSceneGenerator {

    #userItems: Item[];

    #msgs: { msgId: number, itemId: string }[];

    showStockScene() {

        const showStock = new Scenes.BaseScene<Scenes.SceneContext>('showStock');

        showStock.enter(async (ctx: any) => {

            this.#msgs = [];

            const userItems: User | null = await UserModel.findOne({ chatId: ctx.chat.id })
                .populate({
                    path: 'items',
                }).exec();

            await ctx.replyWithMarkdown(`*${STOCK_SCENE_MESSAGES.UR_STOCK}*`, Markup.keyboard([
                [ BUTTON_TEXT.RETURN ]
            ]).resize());

            if (userItems && userItems.items && userItems.items.length) {

                const { items } = userItems;

                this.#userItems = items;

                const length: number = items?.length;

                for (let i = 0; i < length; i++) {

                    const msg = await ctx.replyWithMarkdown(
                        createItemStockMsg(items[i]),

                        Markup.inlineKeyboard([
                            createURLButton(BUTTON_TEXT.GOTO_SITE, items[i].link),
                            Markup.button.callback(BUTTON_TEXT.REMOVE, items[i].id!),
                        ])
                    );

                    this.#msgs.push({
                        msgId: msg.message_id,
                        itemId: items[i].id!
                    });
                }

            } else {
                await ctx.replyWithMarkdown(`*${STOCK_SCENE_MESSAGES.EMPTY_STOCK2}*`);
            }
        });

        showStock.hears(BUTTON_TEXT.RETURN, async (ctx: any) => {

            for (const item of this.#msgs) {
                await ctx.telegram.deleteMessage(ctx.chat.id, item.msgId);
            }

            this.#userItems = [];

            await ctx.telegram.deleteMessage(ctx.chat.id, ctx.message.message_id);

            await ctx.replyWithMarkdown(`*${STOCK_SCENE_MESSAGES.U_LEAVE}*`, mainKeyboard);

            await ctx.scene.leave();
        });

        showStock.on('callback_query', async (ctx: any) => {

            const action = ctx.update.callback_query.data;

            const item = this.#userItems.find(i => i.id === action);

            if (item) {

                const msg: { msgId: number, itemId: string } | undefined = this.#msgs.find(msg => msg.itemId === item.id);

                if (msg) {
                    await ctx.telegram.deleteMessage(ctx.chat.id, msg.msgId);
                }

                const currentUser: any = await UserModel.findOne({ chatId: ctx.chat.id });

                if (!currentUser) {
                    return await ctx.replyWithMarkdown(`*${ ERRORS.USER_SEARCH }*`)
                }

                this.#msgs = this.#msgs.filter((msg: any) => msg.itemId !== item.id);

                currentUser.items = currentUser.items.filter((i: any) => i._id.toString() !== item.id);
                currentUser.save();

                await ItemModel.deleteOne({ _id: item.id }).exec();

                await ctx.replyWithMarkdown(`*${ deleteItemMessage(item.name) }*`);

            }

        });


        return showStock;
    }

}
