const {Markup} = require("telegraf");

export default {

    mainKeyboard: Markup.keyboard([
        ['Добавить товар'],
        ['Удалить товар',],
        ['Инвентарь'],
    ]).resize()

}
