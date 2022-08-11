import { Item } from '../db/interfaces/item.interface';

export enum MESSAGES {
    NEW_USER_DESCRIPTION = 'Hello! This bot can help you with price monitoring! Just add link to the item what you want to see!'
}

export const itemStockMsg = (item: Item): string => `${ item.name! } - ${ item.initialPrice }\n\n${ item.link }`;
