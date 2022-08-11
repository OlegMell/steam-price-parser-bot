export const startMainKeyboardListener = (bot: any) => {

        bot.hears('Добавить товар', async (ctx: any) => {
            await bot.telegram.sendMessage(ctx.chat.id, 'ДОБАВЛЕНИЕ ТОВАРА', {
                reply_markup: {
                    remove_keyboard: true
                }
            });
            await ctx.scene.enter('addItemName');
        });

        bot.hears('Удалить товар', (ctx: any) => {
            ctx.reply('Удалить товар');
        });

        bot.hears('Инвентарь', (ctx: any) => {
            ctx.replyWithMarkdown('*Инвентарь*');
            ctx.scene.enter('showStock');
        });

    }


