import { UserModel } from "../db.config.js";
import { helpers } from "../../helpers/helpers.js";
import { User as IUSer } from '../interfaces/user.interface';


export const User = {

    findOneBy: async (by: { [key: string]: string | number }) => {
        return UserModel.findOne(by);
    },

    create: async (chatUser: any) => {

        return UserModel.create({
            name: helpers.getNameFromChat(chatUser),
            chatId: chatUser.chat.id,
            items: [],
            crypts: []
        });

    },

    getUsersPopulate: async (): Promise<IUSer[] | null> => {
        return UserModel
            .find()
            .populate({
                path: 'items',
            }).exec();
    },

}
