import { helpers } from '../helpers/helpers';
import { sendMessage } from '../bot/helpers';
import { DOMHelper } from './helpers/DOMHelper';
import { PuppeteerHelper } from './helpers/PuppeteerHelper';
import { User as IUSer } from '../db/interfaces/user.interface';
import { fetchPageErrorMessage, notFoundPriceMessage, priceMessage } from '../bot/consts';
import { PARSE_MODE, PARSE_MODE_UNION } from './configs';


/**
 * Парсинг сайта Steam по товарам для поиска текущих цен
 */
export const steamParser = async (bot: any, user: IUSer, puppeteerHelper: PuppeteerHelper, parseMode: PARSE_MODE_UNION = PARSE_MODE.AUTO) => {

    const messages: string[] = [];

    const RETRY_LIMIT: number = 3;

    let tmpMessages: any[] = [];

    for (const userItem of user.items!) {

        let pageContent: string = '';

        let tryCounter: number = 1;

        // Три попытки на запрос к Стиму. Если за три попытки не получили контент - отправим сообщение об этом юзеру
        do {

            if (parseMode === PARSE_MODE.MANUAL) {
                tmpMessages.push(
                    await bot.telegram.sendMessage(user.chatId, `ПОИСК ТОВАРА: ${userItem.name}\nПОПЫТКА ${tryCounter} / ${RETRY_LIMIT}`)
                );
            }

            await puppeteerHelper.goTo(userItem.link).catch((err) => {
                console.log(err);
            });

            pageContent = await puppeteerHelper.getPageContent(userItem.selectorHTML);

            if (pageContent) {
                break;
            }

            tryCounter++;

            console.log('TRY NUMBER: ', tryCounter);

        } while (tryCounter <= RETRY_LIMIT);


        if (!pageContent) {
            messages.push(fetchPageErrorMessage(userItem.name));
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


    // удаление сообщений о попытках поиска товаров
    if (parseMode === PARSE_MODE.MANUAL) {

        for await (const msg of tmpMessages) {
            bot.telegram.deleteMessage(user.chatId, msg.message_id);
        }

        tmpMessages = [];
    }


    await sendMessage(bot, user.chatId, collectedPriceMessage);
}
