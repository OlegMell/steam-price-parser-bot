import { Item } from '../db/interfaces/item.interface';

export enum MESSAGES {
    HELLO = 'Привет, ',

    NEW_USER_DESCRIPTION = 'Hello! This bot can help you with price monitoring! Just add link to the item what you want to see!',

    ADD_ITEM = 'ДОБАВЛЕНИЕ ТОВАРА',

    REMOVE_ITEM = 'УДАЛЕНИЕ ТОВАРА',

    STOCK = 'ИНВЕНТАРЬ'
}

export const itemStockMsg = (item: Item): string => `${ item.name! } - ${ item.initialPrice }\n\n${ item.link }`;

export const createPriceMessage = ({ name, initialPrice, }: Item, price: string): string => {
    return `ТОВАР: ${ name }\nНАЧАЛЬНАЯ ЦЕНА $${ initialPrice }\nНОВАЯ ЦЕНА: $${ price }`;
}

export const createNotFoundPriceMessage = ({ name }: Item): string => {
    return `По товару ${ name } цена не найдена! Проверьте CSS селектор в Инвентаре.`;
}
