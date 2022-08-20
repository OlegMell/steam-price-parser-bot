import { User as IUSer } from '../db/interfaces/user.interface';
import { sendMessage } from '../bot/helpers';
import { fetchPageErrorMessage, notFoundPriceMessage, priceMessage } from '../bot/messages';
import { DOMHelper } from './helpers/DOMHelper';
import { helpers } from '../helpers/helpers';
import { PuppeteerHelper } from './helpers/PuppeteerHelper';

export const steamParser = async (bot: any, user: IUSer, puppeteerHelper: PuppeteerHelper) => {

    const messages: string[] = [];

    for (const userItem of user.items!) {

        await puppeteerHelper.goTo(userItem.link);

        const pageContent: string = await puppeteerHelper.getPageContent(userItem.selectorHTML);

        if (!pageContent) {

            await sendMessage(bot, user.chatId, fetchPageErrorMessage(userItem.name));

        } else {

            const domHelper: DOMHelper = new DOMHelper(pageContent);

            let price: string | null = domHelper.getTextFrom(userItem.selectorHTML, 1);

            if (price) {
                price = helpers.getClearPrice(price!);

                messages.push(priceMessage(userItem, price));
                // await sendMessage(bot, user.chatId, priceMessage(userItem, price));
            } else {
                messages.push(notFoundPriceMessage(userItem));
                // await sendMessage(bot, user.chatId, notFoundPriceMessage(userItem));
            }
        }
    }

    const collectedPriceMessage = messages.join('\n\n');

    await sendMessage(bot, user.chatId, collectedPriceMessage);
}
