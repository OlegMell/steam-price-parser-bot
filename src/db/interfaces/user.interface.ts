import { Item } from './item.interface';

export interface User {
    name: string,
    chatId: number,
    password?: string,
    items?: Item[],
    crypts?: any[]
}
