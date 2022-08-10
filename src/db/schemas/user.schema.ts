import mongoose from 'mongoose';

const { Schema } = mongoose;

const UserSchema = new Schema({
    name: String,
    password: String,
    chatId: Number,
    items: [ { type: Schema.Types.ObjectId, ref: 'Item' } ],
    crypts: []
});

export default UserSchema;
