import dotenv from 'dotenv';
dotenv.config();

const express = require('express');

const bot = require('./bot');

const app = express();

const port = process.env.PORT || 5000;

app.use(express.json());

app.get('/', (req: Request, res: any) => {
    console.log(req);
    res.status(200).json({ message: 'Hello from the Bot API.' });
});
// TELEGRAM WEBHOOK - https://core.telegram.org/bots/api#setwebhook
app.post(`/${process.env.BOT_TOKEN}`, (req: Request, res: any) => {
    bot.processUpdate(req.body);
    res.status(200).json({ message: 'ok' });
});

app.listen(port, () => {
    console.log(`\n\nServer running on port ${port}.\n\n`);
});


import startParseBot from './bot/start.js';

(async () => await startParseBot())()
    .then(() => {
        console.log('App started');
    })
    .catch((err) => {
        console.log(err);
    });


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
