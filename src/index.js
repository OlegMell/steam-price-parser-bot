"use strict";
require('dotenv').config();
const startParseBot = require("./bot/start");
startParseBot();
// const startParse = async () => {
//
//     const bot = new Telegraf(process.env.BOT_TOKEN);
//
//     bot.start(async (ctx) => {
//
//
//         const browser = await puppeteer.launch();
//         const page = await browser.newPage();
//
//         await page.goto(url, { waitUntil: 'networkidle2' });
//
//         setInterval(async () => {
//
//             await page.waitForSelector('span.market_commodity_orders_header_promote');
//
//             const c = await page.content();
//             const dom = new JSDOM(c);
//
//             let price = dom.window.document.querySelectorAll('span.market_commodity_orders_header_promote')[1].textContent;
//
//             const currentPrice = getClearPrice(price);
//
//             ctx.reply(`Current price: ${currentPrice}`);
//
//         }, 10000);
//
//         const keyboard = Markup.keyboard([
//             ['Добавить товар'],
//         ]);
//
//         ctx.reply('hello', keyboard);
//     });
//
//     bot.hears('Добавить товар', ctx => {
//         ctx.reply('Пришлите ссылку');
//
//         bot.on('text', (ctx) => {
//             ctx.reply('OK');
//         })
//     });
//
//     bot.launch();
//
//
// }
//
// startParse();
