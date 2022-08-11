const mongoose = require('mongoose');
const {Schema} = mongoose;

const ItemSchema = new Schema({
    name: String,
    link: String,
    prevPrice: String,
    initialPrice: String,
    selectorHTML: String,
    dateTime: Date
});

export default ItemSchema;
