import { Telegraf, Scenes, session } from 'telegraf';

import startDBConnect from '../db/db.connect.js';

import { User } from '../db/models/user.model.js';
import { MESSAGES } from './messages.js';
import { mainKeyboard } from './keyboard.js';
import { startMainKeyboardListener } from './mainKeyboardListener.js';

import { setStageScenes } from './stage';


export default async function startParseBot() {

    await startDBConnect();

    let bot: Telegraf<Scenes.SceneContext>;

    bot = new Telegraf(process.env.BOT_TOKEN || '')


    // const app = express();

    // const port = process.env.PORT || 5000;
    //
    // app.use(express.json());

    // const secretPath = `/telegraf/${ bot.secretPathComponent() }`;
    // const secretPath = `/telegraf`;



    // if (process.env.NODE_ENV === 'production') {
    //     console.log('here');
    //
    //     // app.use(bot.webhookCallback(secretPath));
    //     // bot.telegram.setWebhook(`${process.env.HEROKU_URL}${secretPath}`);
    //     // bot.telegram.setWebhook(`${secretPath}`);
    //
    //
    // }

        // app.get('/', (req: Request, res: any) => {
        //     console.log(req);
        //     res.status(200).json({ message: 'Hello from the Bot API.' });
        // });
        //
        // app.post(`${secretPath}`, (req, res) => {
        //     const update = req.body
        //
        //     console.log(update);
        //
        //     bot.handleUpdate(update)
        //         .finally(() => {
        //             res.send(update);
        //         })
        // })

    //     app.post('/setWebhook', (req, res) => {
    //         // @ts-ignore
    //         let base, whPath, whURL, isProd
    //         const params = req?.body
    //
    //         console.log(params);
    //
    //         // if (!params) {
    //         //     res.error()
    //         // }
    //
    //         // local whURL should be like: 'https://terrible-goat-29.loca.lt/prj-name/us-central1/bot/hello'
    //         // remote whURL should be like: 'https://us-central1-zxsvm-chufar.cloudfunctions.net/bot/hello'
    //
    //         isProd = process.env.NODE_ENV;
    //
    //         // base = req?.body?.base || BASE_URL // https://terrible-goat-29.loca.lt
    //         // whPath = req?.body?.path || WEBHOOK_PATH // hello
    //
    //         whURL = `https://floppy-grapes-send-93-76-59-54.loca.lt${secretPath}`
    //
    //         bot.telegram.setWebhook(whURL)
    //             .then(() => {
    //                 // @ts-ignore
    //                 res.send({ whURL })
    //             })
    //     })
    //
    // }
    //
    //
    //
    // app.listen(port, () => {
    //     console.log(`\n\nServer running on port ${ port }.\n\n`);
    // });

    const stage = setStageScenes();
    //
    bot.use(session());
    bot.use(stage.middleware());
    //
    // bot.webhookCallback(`${ process.env.HEROKU_URL }${ process.env.BOT_TOKEN }`);
    //
    //
    bot.start(async (ctx: any) => {

        const user = await User.findOneBy({ chatId: ctx.chat.id });

        if (!user) {

            await User.create(ctx);

            await ctx.reply(MESSAGES.NEW_USER_DESCRIPTION, mainKeyboard);

        } else {
            await ctx.reply('Hi there!', mainKeyboard);
        }


    });

    startMainKeyboardListener(bot);

    // bot.startWebhook
    // await bot.launch();
    // if (process.env.NODE_ENV !== 'production')

    // bot.telegram.setWebhook(process.env.HEROKU_URL+secretPath);

    // @ts-ignore
    // app.get('/', (req, res) => res.send('Hello World!'))

    // app.post(secretPath, (req, res) => {
    //     console.log(req.body)
    //     return bot.handleUpdate(req.body, res)
    // })
    //
    // app.use(bot.webhookCallback(secretPath))
    //
    // app.listen(port, () => {
    //     console.log(`Example app listening on port ${port}!`)
    // })

    // bot.on("text", (ctx) => ctx.replyWithHTML("<b>Hello</b>"));

    return bot;

}

