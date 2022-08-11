import { Context, Scenes } from 'telegraf';
import { helpers } from '../../helpers/helpers';
import { Update } from 'telegraf/typings/core/types/typegram';
import { addItemConfirmKeyboard, mainKeyboard } from '../keyboard';
import { ItemModel, UserModel } from '../../db/db.config';

export class AddItemSceneGenerator {

    #createdItemTempl: { name: string, link: string, initialPrice: number, selectorHTML: string } | undefined;

    addItemNameScene() {
        const addItemName = new Scenes.BaseScene('addItemName');

        addItemName.enter(async (ctx: Context<Update>) => {

            this.#createdItemTempl = {} as { name: string, link: string, initialPrice: number, selectorHTML: string };

            // await ctx.replyWithMarkdown('*ДОБАВЛЕНИЕ ТОВАРА*');

            await ctx.reply('Введите название товара');
        });

        addItemName.on('text', async (ctx: any) => {
            this.#createdItemTempl!.name = ctx.message.text;
            await ctx.scene.enter('addItem');
        });

        return addItemName;
    }

    addItemLinkScene() {

        const addItem = new Scenes.BaseScene('addItem');

        addItem.enter(async (ctx: any) => {


            await ctx.reply('Введите ссылку на товар:');
        });

        addItem.on('text', async (ctx: any) => {

            const link: string = ctx.message.text;

            if (!helpers.validateLink(link)) {
                await ctx.reply('Вы ввели не действительную ссылку!');
                await ctx.scene.reenter();
            } else {
                this.#createdItemTempl!.link = link;
                await ctx.scene.enter('addItemPrice');
            }
        });

        return addItem;
    }

    addItemPriceScene() {
        const addItemPrice = new Scenes.BaseScene('addItemPrice');

        addItemPrice.enter(async (ctx: any) => {
            await ctx.reply('Введите начальную цену: ');
        });

        addItemPrice.on('text', async (ctx: any) => {

            const initialPrice = Number(ctx.message.text);

            if (!initialPrice || isNaN(initialPrice)) {
                await ctx.scene.reenter();
            } else {
                this.#createdItemTempl!.initialPrice = initialPrice;
                await ctx.scene.enter('addItemSelector');
            }

        });

        return addItemPrice;
    }

    addItemSelectorScene() {

        const addItemSelector = new Scenes.BaseScene('addItemSelector');

        addItemSelector.enter(async (ctx: any) => {
            await ctx.reply('Введите CSS селектор товара для поиска: ');
        });

        addItemSelector.on('text', async (ctx: any) => {

            this.#createdItemTempl!.selectorHTML = ctx.message.text;

            await ctx.replyWithMarkdown('*ВЫ ДОБАВЛЯЕТЕ:*');
            await ctx.reply(`${ this.#createdItemTempl!.name }\n${ this.#createdItemTempl!.link }\n${ this.#createdItemTempl!.initialPrice }\n${ this.#createdItemTempl!.selectorHTML }`)

            await ctx.scene.enter('addItemConfirm');
        });

        return addItemSelector;
    }

    addItemConfirmScene() {

        const addItemConfirm = new Scenes.BaseScene('addItemConfirm');

        addItemConfirm.enter(async (ctx: any) => {
            await ctx.replyWithMarkdown('*Сохранить товар?*', addItemConfirmKeyboard);
        });

        addItemConfirm.hears('Да', async (ctx: any) => {

            const newItem = await ItemModel.create(this.#createdItemTempl);

            const user = await UserModel.findOne({ chatId: ctx.chat.id });

            if (user) {
                await UserModel.updateOne({
                    chatId: ctx.chat.id
                }, {
                    $addToSet: {
                        items: [
                            newItem
                        ]
                    }
                })
                    .then(() => ctx.replyWithMarkdown('*Товар успешно сохранен*', mainKeyboard))
                    .catch(() => ctx.replyWithMarkdown('* Не удалось сохранить товар! Попробуйте позже :( *', mainKeyboard));
            }

            addItemConfirm.leave();
        });

        addItemConfirm.hears('Нет', async (ctx: any) => {
            this.#createdItemTempl = undefined;
            await ctx.replyWithMarkdown('*Добавление товара отмененно*', mainKeyboard);
            await addItemConfirm.leave();
        });


        return addItemConfirm;
    }

}

