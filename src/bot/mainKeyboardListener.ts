export const startMainKeyboardListener = (bot: any) => {

        bot.hears('Добавить товар', async (ctx: any) => {
            await bot.telegram.sendMessage(ctx.chat.id, 'ДОБАВЛЕНИЕ ТОВАРА', {
                reply_markup: {
                    remove_keyboard: true
                }
            });
            await ctx.scene.enter('addItemName');
        });

        bot.hears('Удалить товар', async (ctx: any) => {
            await ctx.replyWithMarkdown('*УДАЛЕНИЕ ТОВАРА*');
            await ctx.scene.enter('deleteItem');
        });

        bot.hears('Инвентарь', async (ctx: any) => {
            await ctx.replyWithMarkdown('*ИНВЕНТАРЬ*');
            await ctx.scene.enter('showStock');
        });

    }


