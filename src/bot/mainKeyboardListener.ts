export const startMainKeyboardListener = (bot: any) => {

        bot.hears('Добавить товар', async (ctx: any) => {
            await ctx.scene.enter('addItemName');
        });

        bot.hears('Удалить товар', (ctx: any) => {
            ctx.reply('Удалить товар');
        });

        bot.hears('Инвентарь', (ctx: any) => {
            ctx.reply('Инвентарь');
        });

    }


