import { Scenes } from 'telegraf';


export class SceneGenerator {

    addItemLinkScene() {
        const addItem = new Scenes.BaseScene('addItem');

        addItem.enter(async (ctx: any) => {
            await ctx.replyWithMarkdown('**Добавление товара**');
            await ctx.reply('Введите ссылку на товар');
        });

        addItem.on('text', async (ctx: any) => {
            await ctx.reply(ctx.message.text);
            await ctx.scene.enter('addItemPrice')
        });

        return addItem;
    }

    addItemPriceScene() {
        const addItemPrice = new Scenes.BaseScene('addItemPrice');

        addItemPrice.enter(async (ctx: any) => {
            await ctx.reply('Введите начальную цену');
        });

        addItemPrice.on('text', async (ctx: any) => {
            await ctx.reply(ctx.message.text);

            await ctx.scene.enter('addItemSelector');
        });

        return addItemPrice;
    }

    addItemSelectorScene() {

        const addItemSelector = new Scenes.BaseScene('addItemSelector');

        addItemSelector.enter(async (ctx: any) => {

            await ctx.reply('Введите селектор товара для поиска');

        });

        addItemSelector.on('text', async (ctx: any) => {
            await ctx.reply('OK!');
            await ctx.scene.leave();
        });

        return addItemSelector;
    }

}

