import mongoose from 'mongoose';

import { Item } from '../interfaces/item.interface';

const { Schema } = mongoose;

const ItemSchema = new Schema<Item>({
    name: String,
    link: String,
    prevPrice: String,
    initialPrice: String,
    selectorHTML: String,
    dateTime: Date
});

export default ItemSchema;
