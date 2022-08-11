import dotenv from 'dotenv';
dotenv.config();


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
