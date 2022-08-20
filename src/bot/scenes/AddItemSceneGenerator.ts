import { Context, Scenes } from 'telegraf';
import { helpers } from '../../helpers/helpers';
import { Update } from 'telegraf/typings/core/types/typegram';
import { addItemConfirmKeyboard, mainKeyboard } from '../keyboard';
import { ItemModel, UserModel } from '../../db/db.config';
import { PuppeteerHelper } from '../../parser/helpers/PuppeteerHelper';
import { DOMHelper } from '../../parser/helpers/DOMHelper';
import { CSS_SELECTORS } from '../../parser/configs';
import { ERRORS, MESSAGES } from '../messages';

export class AddItemSceneGenerator {

    #createdItemTempl: { name?: string, link: string, initialPrice: number, selectorHTML?: string } | undefined;

    addItemNameScene() {
        const addItemName = new Scenes.BaseScene<Scenes.SceneContext>('addItemName');

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

        const addItem = new Scenes.BaseScene<Scenes.SceneContext>('addItem');

        addItem.enter(async (ctx: any) => {
            this.#createdItemTempl = {} as { name: string, link: string, initialPrice: number, selectorHTML: string };

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
        const addItemPrice = new Scenes.BaseScene<Scenes.SceneContext>('addItemPrice');

        addItemPrice.enter(async (ctx: any) => {
            await ctx.reply('Введите начальную цену: ');
        });

        addItemPrice.on('text', async (ctx: any) => {

            const initialPrice = Number(ctx.message.text);

            if (!initialPrice || isNaN(initialPrice)) {
                await ctx.scene.reenter();
            } else {
                this.#createdItemTempl!.initialPrice = initialPrice;
                await ctx.scene.enter('addItemConfirm');
            }

        });

        return addItemPrice;
    }

    addItemSelectorScene() {

        const addItemSelector = new Scenes.BaseScene<Scenes.SceneContext>('addItemSelector');

        addItemSelector.enter(async (ctx: any) => {
            await ctx.reply('Введите CSS селектор товара для поиска: ');
        });

        addItemSelector.on('text', async (ctx: any) => {

            this.#createdItemTempl!.selectorHTML = ctx.message.text;

            await ctx.scene.enter('addItemConfirm');
        });

        return addItemSelector;
    }

    addItemConfirmScene() {

        const addItemConfirm = new Scenes.BaseScene<Scenes.SceneContext>('addItemConfirm');

        addItemConfirm.enter(async (ctx: any) => {

            const waitForSearchMsg = await ctx.replyWithMarkdown(`*${MESSAGES.WAIT_FOR_SEARCHING}*`);

            const puppeteerHelper = new PuppeteerHelper();

            await puppeteerHelper.createBrowserPage();

            await puppeteerHelper.goTo(this.#createdItemTempl?.link!);

            const pageContent: string = await puppeteerHelper.getPageContent(CSS_SELECTORS.ITEM_NAME);

            if (!pageContent) {
                await ctx.telegram.deleteMessage(ctx.chat.id, waitForSearchMsg.message_id);
                await ctx.replyWithMarkdown(ERRORS.FETCH_HTML_MD, mainKeyboard);
                await ctx.scene.enter('addItem');

            } else {
                await ctx.telegram.deleteMessage(ctx.chat.id, waitForSearchMsg.message_id);

                const domHelper: DOMHelper = new DOMHelper(pageContent);

                const itemName: string | null = domHelper.getTextFrom(CSS_SELECTORS.ITEM_NAME);

                this.#createdItemTempl!.name = itemName || 'НАЗВАНИЕ НЕ НАЙДЕНО';

                await ctx.replyWithMarkdown('*ВЫ ДОБАВЛЯЕТЕ:*');

                await ctx.replyWithMarkdown(`Название товара: *${ this.#createdItemTempl!.name }*\nНачальная цена: *$${ this.#createdItemTempl!.initialPrice }*\nСсылка: ${ this.#createdItemTempl!.link }`)

                await ctx.replyWithMarkdown('*СОХРАНИТЬ ТОВАР?*', addItemConfirmKeyboard);
            }
        });

        addItemConfirm.hears('Да', async (ctx: any) => {

            const newItem = await ItemModel.create({
                ...this.#createdItemTempl,
                selectorHTML: CSS_SELECTORS.ITEM_PRICE
            });

            const filter = { chatId: ctx.chat.id };

            const update = {
                $addToSet: {
                    items: [
                        newItem
                    ]
                }
            };

            await UserModel.findOneAndUpdate(filter, update)
                .then(() => ctx.replyWithMarkdown(`*${ MESSAGES.SUCCESSFULLY_SAVED }*`, mainKeyboard))
                .catch(() => ctx.replyWithMarkdown( `*${ERRORS.SAVE_ERR} * `, mainKeyboard));

            addItemConfirm.leave();
        });

        addItemConfirm.hears('Нет', async (ctx: any) => {
            this.#createdItemTempl = undefined;
            await ctx.replyWithMarkdown('*ДОБАВЛЕНИЕ ТОВАРА ОТМЕНЕННО*', mainKeyboard);
            await addItemConfirm.leave();
        });


        return addItemConfirm;
    }

}

