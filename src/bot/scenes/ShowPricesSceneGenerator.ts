import { Markup, Scenes } from 'telegraf';

import { MESSAGES } from '../messages';
import { mainKeyboard } from '../keyboard';

export class ShowPricesSceneGenerator {

    showPricesScene() {

        const showPrices = new Scenes.BaseScene<Scenes.SceneContext>('showPrices');

        showPrices.enter(async (ctx: any) => {

            await ctx.replyWithMarkdown(`*${ MESSAGES.SHOW_PRICES }*`, Markup.keyboard([
                [ 'Назад' ]
            ]).resize());

        });

        showPrices.hears('Назад', async (ctx: any) => {
            await ctx.telegram.deleteMessage(ctx.chat.id, ctx.message.message_id);
            await ctx.replyWithMarkdown('*ВЫ ВЫШЛИ ИЗ ПРОСМОТРА ЦЕН*', mainKeyboard);
            await ctx.scene.leave();
        });

        return showPrices;
    }

}
