import { Item } from '../db/interfaces/item.interface';

export enum MESSAGES {
    HELLO = 'Привет, ',

    NEW_USER_DESCRIPTION = 'Hello! This bot can help you with price monitoring! Just add link to the item what you want to see!',

    ADD_ITEM = 'ДОБАВЛЕНИЕ ТОВАРА',

    REMOVE_ITEM = 'УДАЛЕНИЕ ТОВАРА',

    SHOW_PRICES = 'ТЕКУЩИЕ ЦЕНЫ',

    STOCK = 'ИНВЕНТАРЬ',

    FETCH_HTML_ERROR_MD = '*ERROR*\n*ВОЗНИКЛИ ПРОБЛЕМЫ С САЙТОМ. ПОПРОБУЙТЕ СНАЧАЛА*',

    SUCCESSFULLY_SAVED = 'ТОВАР УСПЕШНО СОХРАНЕН',

    SAVE_ERROR = 'НЕ УДАЛОСЬ СОХРАНИТЬ ТОВАР! ПОПРОБУЙТЕ ПОЗЖЕ :(',

    ITEM_NOT_FOUND = 'ТОВАР НЕ НАЙДЕН',

    USER_SEARCH_ERROR = 'ВОЗНИКЛИ ПРОБЛЕМЫ С ПОИСКОМ ПОЛЬЗОВАТЕЛЯ. ПОПРОБУЙТЕ ПОЗЖЕ'
}

export const createItemStockMsg = (item: Item): string => `НАЗВАНИЕ ТОВАРА: *${ item.name! }*\nНАЧАЛЬНАЯ ЦЕНА: *$${ item.initialPrice }*`;

export const priceMessage = ({ name, initialPrice, }: Item, price: string): string => {
    return `ТОВАР: ${ name }\nНАЧАЛЬНАЯ ЦЕНА: $${ initialPrice }\nНОВАЯ ЦЕНА: $${ price }`;
}

export const notFoundPriceMessage = ({ name }: Item): string => {
    return `ПО ТОВАРУ ${ name } ЦЕНА НЕ НАЙДЕНА!\nПОПРОБУЙТЕ ВЫПОЛНИТЬ ПОИСК ЦЕН ВРУЧНУЮ ИЛИ ДОЖДИТЕСЬ СЛЕДУЮЩЕЙ РАССЫЛКИ!`;
}

export const fetchPageErrorMessage = (itemName: string): string =>
    `НЕ УДАЛОСЬ ПОЛУЧИТЬ HTML СТРАНИЦУ ТОВАРА: ${itemName}\nПОПРОБУЙТЕ ВЫПОЛНИТЬ ПОИСК ЦЕН ВРУЧНУЮ!`;

export const deleteItemMessage = (itemName: string): string =>
    `ТОВАР: ${ itemName } БЫЛ УДАЛЕН`;
