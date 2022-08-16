/**
 * Отправка сообщение напрямую из бота
 * @param bot Инстанс Телеграм бота
 * @param chatId Id чата для отправки сообщения
 * @param msg текст сообщения
 */
export const sendMessage = (bot: any, chatId: string | number, msg: string) => {
    return bot.telegram.sendMessage(chatId, msg);
}
