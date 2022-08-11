import { Scenes } from 'telegraf';
import { UserModel } from '../../db/db.config';


export class StockSceneGenerator {

    showStockScene() {
        const showStock = new Scenes.BaseScene<Scenes.SceneContext>('showStock');

        showStock.enter(async (ctx: any) => {
            const userItems = await UserModel.findOne({ chatId: ctx.chat.id })
                .populate({
                    path: 'items',
                }).exec();

            if (userItems && userItems.items) {

                await ctx.replyWithMarkdown('*Ваш инвентарь:*');

                const length: number = userItems?.items?.length;
                const { items } = userItems;

                for (let i = 0; i< length; i++) {

                    // @ts-ignore
                    await ctx.reply(`${items[i]?.name!} - ${items[i].initialPrice}\n\n${items[i].link}`);
                }

            }

            showStock.leave();
        });

        return showStock;
    }

}
