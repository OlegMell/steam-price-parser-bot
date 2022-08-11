import { Context, Scenes } from 'telegraf';
import { helpers } from '../../helpers/helpers';
import { ItemModel } from '../../db/db.config';
import { Update } from 'telegraf/typings/core/types/typegram';

export class SceneGenerator {

    #createdItemTempl: any;

    addItemNameScene() {
        const addItemName = new Scenes.BaseScene('addItemName');

        addItemName.enter(async (ctx: Context<Update>) => {

            await ctx.replyWithMarkdown('*ДОБАВЛЕНИЕ ТОВАРА*');

            await ctx.reply('Введиnе название овара');

            this.#createdItemTempl = await ItemModel.create({});

        });

        addItemName.on('text', async (ctx: any) => {
            const name: string = (ctx.message as any).text;
            await ItemModel.findOneAndUpdate({ id: this.#createdItemTempl._id }, { $set: { name } });
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
                await ctx.reply('Вы ввели не дейсвиельную ссылку!');
                await ctx.scene.reenter();
            } else {
                await ItemModel.findOneAndUpdate({ id: this.#createdItemTempl._id }, { $set: { link } });
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
                await ItemModel.findOneAndUpdate({ id: this.#createdItemTempl._id }, { $set: { initialPrice } });
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
            const selectorHTML: string = ctx.message.text;
            const createdItem: any = await ItemModel.findOneAndUpdate({ id: this.#createdItemTempl._id },
                { $set: { selectorHTML } });

            await ctx.reply(`${ createdItem.link }\n${ createdItem.initialPrice }\n${ createdItem.selectorHTML }`)

            await ctx.scene.leave();
        });

        return addItemSelector;
    }

}

