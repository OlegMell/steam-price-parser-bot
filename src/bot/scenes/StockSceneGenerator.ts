import { Markup, Scenes } from 'telegraf';

import { ItemModel, UserModel } from '../../db/db.config';
import { User } from '../../db/interfaces/user.interface';
import { createURLButton, mainKeyboard } from '../keyboard';
import { itemStockMsg } from '../messages';
import { Item } from '../../db/interfaces/item.interface';


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

            await ctx.replyWithMarkdown('*Ваш инвентарь:*', Markup.keyboard([
                [ 'Назад' ]
            ]).resize());

            if (userItems && userItems.items && userItems.items.length) {

                const { items } = userItems;

                this.#userItems = items;

                const length: number = items?.length;

                for (let i = 0; i < length; i++) {

                    const msg = await ctx.reply(
                        itemStockMsg(items[i]),

                        Markup.inlineKeyboard([
                            createURLButton('Перейти на сайт', items[i].link),
                            Markup.button.callback('Удалить', items[i].id!),
                        ])
                    );

                    this.#msgs.push({
                        msgId: msg.message_id,
                        itemId: items[i].id!
                    });
                }

            } else {
                await ctx.replyWithMarkdown('*Пусто! Вы ещё ничего не добавили!*');
            }
        });

        showStock.hears('Назад', async (ctx: any) => {

            for (const item of this.#msgs) {
                await ctx.telegram.deleteMessage(ctx.chat.id, item.msgId);
            }

            this.#userItems = [];

            await ctx.replyWithMarkdown('*Вы покинули инвентарь*', mainKeyboard);
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

                await ItemModel.deleteOne({ _id: item.id }).exec();
                await ctx.replyWithMarkdown(`*${ item.name } был удален*`);
            }

        });


        return showStock;
    }

}
