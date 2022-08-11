import { Item } from './item.interface';

export interface User extends Document {
    name: string,
    chatId: number,
    password?: string,
    items?: Item[],
    crypts?: any[]
}
