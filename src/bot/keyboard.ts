const { Markup } = require("telegraf");

export const mainKeyboard = Markup.keyboard([
    [ 'Добавить товар' ],
    [ 'Удалить товар', ],
    [ 'Инвентарь' ],
]).resize();


export const addItemConfirmKeyboard = Markup.keyboard([
    [ 'Да' ], [ 'Нет' ]
]).resize();
