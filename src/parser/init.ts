const puppeteer = require("puppeteer/lib/types");
const jsdom = require("jsdom");

const {JSDOM} = jsdom;


module.exports = {

    initPupeeter: async () => {

        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        return {
            browser, page
        }
    },

    // goto: async (url: string) => {
    //     await page.goto(url, { waitUntil: 'networkidle2' });
    // }

}
