import { User as IUSer } from '../db/interfaces/user.interface';
import { DOMHelper } from './helpers/DOMHelper';
import { helpers } from '../helpers/helpers';
import { fetchPageErrorMessage, notFoundPriceMessage, priceMessage } from '../bot/messages';
import { PuppeteerHelper } from './helpers/PuppeteerHelper';

import { User } from '../db/models/user.model';
import { sendMessage } from '../bot/helpers';


export const startParseSchedule = (bot: any, puppeteerHelper: PuppeteerHelper, interval: number): NodeJS.Timer => {

    return setInterval(async () => {

        await puppeteerHelper.createBrowserPage();

        const users: IUSer[] | null = await User.getUsersPopulate();

        if (users && users.length) {

            for (const user of users) {

                if (user && user.items && user.items.length) {

                    for (const userItem of user.items) {

                        await puppeteerHelper.goTo(userItem.link);

                        const pageContent: string = await puppeteerHelper.getPageContent(userItem.selectorHTML);

                        if (!pageContent) {

                            await sendMessage(bot, user.chatId, fetchPageErrorMessage(userItem.name));

                        } else {

                            const domHelper: DOMHelper = new DOMHelper(pageContent);

                            let price: string | null = domHelper.getTextFrom(userItem.selectorHTML, 1);

                            if (price) {
                                price = helpers.getClearPrice(price!);
                                await sendMessage(bot, user.chatId, priceMessage(userItem, price));
                            } else {
                                await sendMessage(bot, user.chatId, notFoundPriceMessage(userItem));
                            }
                        }
                    }
                }
            }
        }

        await puppeteerHelper.close();

    }, interval);
}
