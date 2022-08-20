import { Item } from '../db/interfaces/item.interface';

/**
 * ОБщие сообщения
 */
export enum MESSAGES {
    HELLO = 'Привет, ',

    NEW_USER_DESCRIPTION = 'Hello! This bot can help you with price monitoring! Just add link to the item what you want to see!',

    ADD_ITEM = 'ДОБАВЛЕНИЕ ТОВАРА',

    REMOVE_ITEM = 'УДАЛЕНИЕ ТОВАРА',

    SHOW_PRICES = 'ТЕКУЩИЕ ЦЕНЫ',

    STOCK = 'ИНВЕНТАРЬ',

    SUCCESSFULLY_SAVED = 'ТОВАР УСПЕШНО СОХРАНЕН',

    ITEM_NOT_FOUND = 'ТОВАР НЕ НАЙДЕН',

    EMPTY_STOCK = 'У ВАС ПУСТОЙ ИНВЕНТАРЬ!\nДОБАВЬТЕ ТОВАРЫ ДЛЯ ПРОСМОТРА ЦЕН!',

    WAIT_FOR_SEARCHING = 'ОЖИДАЙТЕ, ИДЕТ ПОИСК ТОВАРА..'
}


/**
 * Сообщения об ошибках
 */
export enum ERRORS {

    FETCH_HTML_MD = '*ERROR*\n*ВОЗНИКЛИ ПРОБЛЕМЫ С САЙТОМ. ПОПРОБУЙТЕ СНАЧАЛА*',

    USER_NOT_FOUND = 'ОШИБКА ПОИСКА ПОЛЬЗОВАТЕЛЯ!',

    USER_SEARCH = 'ВОЗНИКЛИ ПРОБЛЕМЫ С ПОИСКОМ ПОЛЬЗОВАТЕЛЯ. ПОПРОБУЙТЕ ПОЗЖЕ',

    SAVE_ERR = 'НЕ УДАЛОСЬ СОХРАНИТЬ ТОВАР! ПОПРОБУЙТЕ ПОЗЖЕ :(',
}


export const createItemStockMsg = (item: Item): string =>
    `НАЗВАНИЕ ТОВАРА: *${ item.name! }*\nНАЧАЛЬНАЯ ЦЕНА: *$${ item.initialPrice }*`;


export const priceMessage = ({ name, initialPrice, }: Item, price: string): string =>
    `ТОВАР: ${ name }\nНАЧАЛЬНАЯ ЦЕНА: $${ initialPrice }\nНОВАЯ ЦЕНА: $${ price }`;


export const notFoundPriceMessage = ({ name }: Item): string =>
    `ПО ТОВАРУ ${ name } ЦЕНА НЕ НАЙДЕНА!\nПОПРОБУЙТЕ ВЫПОЛНИТЬ ПОИСК ЦЕН ВРУЧНУЮ ИЛИ ДОЖДИТЕСЬ СЛЕДУЮЩЕЙ РАССЫЛКИ!`;


export const fetchPageErrorMessage = (itemName: string): string =>
    `НЕ УДАЛОСЬ ПОЛУЧИТЬ HTML СТРАНИЦУ ТОВАРА: ${ itemName }\nПОПРОБУЙТЕ ВЫПОЛНИТЬ ПОИСК ЦЕН ВРУЧНУЮ!`;


export const deleteItemMessage = (itemName: string): string =>
    `ТОВАР: ${ itemName } БЫЛ УДАЛЕН`;
