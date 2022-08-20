import { PuppeteerHelper } from './helpers/PuppeteerHelper';
import { steamParser } from './steam-parser';
import { User as IUSer } from '../db/interfaces/user.interface';
import { User } from '../db/models/user.model';


export const startParseSchedule = (bot: any, puppeteerHelper: PuppeteerHelper, interval: number): NodeJS.Timer => {

    return setInterval(async () => {

        await puppeteerHelper.createBrowserPage();

        const users: IUSer[] | null = await User.getUsersPopulate();

        if (users && users.length) {

            for (const user of users) {

                if (user && user.items && user.items.length) {
                    await steamParser(bot, user, puppeteerHelper);
                }

            }
        }

        await puppeteerHelper.close();


    }, interval);

}

