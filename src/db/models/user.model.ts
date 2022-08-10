import {UserModel} from "../db.config.js";
import {helpers} from "../../helpers/helpers.js";


export const User = {

    findOneBy: async (by: any) => {
        return UserModel.findOne(by);
    },

    create: async (chatUser: any) => {

       return UserModel.create({
            name: helpers.getNameFromChat(chatUser),
            password: '',
            chatId: chatUser.chat.id,
            items: [],
            crypts: []
        });

    }

}
