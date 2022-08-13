import dotenv from 'dotenv';

dotenv.config();

import startParseBot from './bot/start.js';
// import { Telegraf } from 'telegraf';

// (async () => await startParseBot())()
//     .then((r) => {
//         console.log(r);
//         console.log('App started');
//     })
//     .catch((err) => {
//         console.log(err);
//     });

startParseBot()
    .then((bot) => {

        const port = +process.env.PORT!;

        bot.launch({
            webhook: {
                domain: process.env.HEROKU_URL,
                port: port || 5000,
            }
        })
        // bot.launch()

        process.once('SIGINT', () => bot.stop('SIGINT'));
        process.once('SIGTERM', () => bot.stop('SIGTERM'));
    })


// console.log($);
// rp(url)
//     .then(function (html) {
//         //success!
//         // console.log(html);
//         // console.log($.load('span.market_commodity_orders_header_promote').html());
//         const dom = new JSDOM(html);
//         console.log(dom.window.document.querySelector('span.market_commodity_orders_header_promote').textContent);
//         // console.log($("head", html));
//     })
//     .catch(function (err) {
//         console.log(err);
//         //handle error
//     });


// let bot = new Telegraf(process.env.BOT_TOKEN || '')
//
// console.log(bot);
//
// bot.on("text", (ctx) => ctx.replyWithHTML("<b>Hello</b>"));
//
// bot.launch({
//     webhook: {
//         domain: "https://nasty-pillows-check-93-76-59-54.loca.lt",
//         port: 4000,
//     },
// });
//
// // Enable graceful stop
// process.once('SIGINT', () => bot.stop('SIGINT'));
// process.once('SIGTERM', () => bot.stop('SIGTERM'));
