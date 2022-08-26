import { BUTTON_TEXT, COMMON_MESSAGES } from './consts';


export const startMainKeyboardListener = (bot: any) => {

    bot.hears(BUTTON_TEXT.ADD_ITEM, async (ctx: any) => {

        await bot.telegram.sendMessage(ctx.chat.id, COMMON_MESSAGES.ADD_ITEM, {
            reply_markup: {
                remove_keyboard: true
            }
        });

        await ctx.scene.enter('addItem');
    });

    // bot.hears(BUTTON_TEXT.REMOVE_ITEM, async (ctx: any) => {
    //     await ctx.replyWithMarkdown(`*${ MESSAGES.REMOVE_ITEM }*`);
    //     await ctx.scene.enter('deleteItem');
    // });


    bot.hears(BUTTON_TEXT.SHOW_PRICES, async (ctx: any) => {
        await ctx.scene.enter('showPrices');
    });

    bot.hears(BUTTON_TEXT.STOCK, async (ctx: any) => {
        await ctx.replyWithMarkdown(`*${ COMMON_MESSAGES.STOCK }*`);
        await ctx.scene.enter('showStock');
    });

}


