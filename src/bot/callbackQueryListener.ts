module.exports = {

    startListenCallbackQuery: (bot: any) => {

        bot.on('callback_query', async (ctx: any) => {

            const action = ctx.update.callback_query.data;

            switch (action) {

                case 'addItem':

                    ctx.reply('add Item');

                    break;

                case 'deleteItem':
                    ctx.reply('delete item');

                    break;

                case 'showItems':
                    ctx.reply('show items');
                    break;
            }

        });
    }

}
