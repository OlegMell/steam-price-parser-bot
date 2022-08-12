import { ItemModel } from '../../db/db.config';
import { Markup, Scenes } from 'telegraf';
import { mainKeyboard } from '../keyboard';
import { Item } from '../../db/interfaces/item.interface';

export class DeleteItemSceneGenerator {

    deleteItemScene() {
        
        const deleteItem = new Scenes.BaseScene<Scenes.SceneContext>('deleteItem');


        deleteItem.enter(async (ctx: any) => {
            await ctx.replyWithMarkdown('*Введите название товара, который хотите удалить*', Markup.keyboard([
                ['Назад']
            ]).resize());
        });

        deleteItem.hears('Назад', async (ctx: any) => {
            await ctx.replyWithMarkdown('*Удаление отменено*', mainKeyboard);
            await ctx.scene.leave();
        });

        deleteItem.on('text', async (ctx: any) => {
            
            const itemName: string = ctx.message.text;

            const item: Item | null = await ItemModel.findOne({ name: itemName });

            if (!item) {
                await ctx.replyWithMarkdown(`*Товар не найден:*  - ${itemName} `);
                await ctx.scene.reenter();
            } else {
                await ItemModel.deleteOne({ name: itemName }).exec();
                await ctx.replyWithMarkdown(`*Товар успешно удален:*  - ${itemName} `, mainKeyboard);

                await ctx.scene.leave();
            }

        });

        return deleteItem;
    }

}