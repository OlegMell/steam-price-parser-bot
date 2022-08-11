const { Markup } = require("telegraf");

export const mainKeyboard = Markup.keyboard([
    [ 'Добавить товар', 'Удалить товар', 'Инвентарь' ]
]).resize();


export const addItemConfirmKeyboard = Markup.keyboard([
    [ 'Да' ], [ 'Нет' ]
]).resize();


export const createURLButton = (text: string, url: string): any => Markup.button.url(text, url);

export const stockInlineKeyboard = Markup.inlineKeyboard([
    Markup.button.callback('Удалить', 'removeItem'),
])
