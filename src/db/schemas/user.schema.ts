import mongoose from 'mongoose';

import { User } from '../interfaces/user.interface';

const { Schema } = mongoose;

const UserSchema = new Schema<User>({
    name: String,
    password: { type: String, required: false },
    chatId: Number,
    items: [ { type: Schema.Types.ObjectId, ref: 'Item' } ],
    crypts: []
});

export default UserSchema;
