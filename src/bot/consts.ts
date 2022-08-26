import { Item } from '../db/interfaces/item.interface';

/**
 * ОБщие сообщения
 */
export enum COMMON_MESSAGES {
    HELLO = 'Привет, ',

    NEW_USER_DESCRIPTION = 'Hello! This bot can help you with price monitoring! Just add link to the item what you want to see!',

    ADD_ITEM = 'ДОБАВЛЕНИЕ ТОВАРА',

    REMOVE_ITEM = 'УДАЛЕНИЕ ТОВАРА',

    SHOW_PRICES = 'ТЕКУЩИЕ ЦЕНЫ',

    STOCK = 'ИНВЕНТАРЬ',

    SUCCESSFULLY_SAVED = 'ТОВАР УСПЕШНО СОХРАНЕН',

    ITEM_NOT_FOUND = 'ТОВАР НЕ НАЙДЕН',


    WAIT_FOR_SEARCHING = 'ОЖИДАЙТЕ, ИДЕТ ПОИСК ТОВАРА..',

    ENTER_LINK = 'ВВЕДИТЕ ССЫЛКУ НА ТОВАР:',

    ENTER_INITIAL_PRICE = 'ВВЕДИТЕ НАЧАЛЬНУЮ ЦЕНУ:',

    U_ADDING = 'ВЫ ДОБАВЛЯЕТЕ:',

    SAVE_ITEM = 'СОХРАНИТЬ ТОВАР',

    ADDING_CANCELED = 'ДОБАВЛЕНИЕ ТОВАРА ОТМЕНЕННО'

}

export enum STOCK_SCENE_MESSAGES {
    UR_STOCK = 'Ваш инвентарь:',

    EMPTY_STOCK = 'У ВАС ПУСТОЙ ИНВЕНТАРЬ!\nДОБАВЬТЕ ТОВАРЫ ДЛЯ ПРОСМОТРА ЦЕН!',

    EMPTY_STOCK2 = 'ПУСТО! ВЫ ЕЩЁ НИЧЕГО НЕ ДОБАВИЛИ!',

    U_LEAVE = 'Вы покинули инвентарь'
}


export enum SHOW_PRICE_SCENE_MESSAGES {

    SHOW_PRICES = 'ТЕКУЩИЕ ЦЕНЫ',

    U_LEAVE = 'ВЫ ВЫШЛИ ИЗ ПРОСМОТРА ЦЕН',
}

/**
 * Сообщения об ошибках
 */
export enum ERRORS {

    FETCH_HTML_MD = '*ERROR*\n*ВОЗНИКЛИ ПРОБЛЕМЫ С САЙТОМ. ПОПРОБУЙТЕ СНАЧАЛА*',

    USER_NOT_FOUND = 'ОШИБКА ПОИСКА ПОЛЬЗОВАТЕЛЯ!',

    USER_SEARCH = 'ВОЗНИКЛИ ПРОБЛЕМЫ С ПОИСКОМ ПОЛЬЗОВАТЕЛЯ. ПОПРОБУЙТЕ ПОЗЖЕ',

    SAVE_ERR = 'НЕ УДАЛОСЬ СОХРАНИТЬ ТОВАР! ПОПРОБУЙТЕ ПОЗЖЕ :(',

    WRONG_LINK = 'ВЫ ВВЕЛИ НЕ ДЕЙСТВИТЕЛЬНУЮ ССЫЛКУ!',

    ITEM_NAME_NOT_FOUND = 'НАЗВАНИЕ НЕ НАЙДЕНО',

}

export enum BUTTON_TEXT {
    ADD_ITEM = 'Добавить товар',

    SHOW_PRICES = 'Текущие цены',

    STOCK = 'Инвентарь',

    REMOVE_ITEM = 'Удалить товар',

    YEP = 'Да',

    NOP = 'Нет',

    RETURN = 'Назад',

    GOTO_SITE = 'Перейти на сайт',

    REMOVE = 'Удалить',
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
