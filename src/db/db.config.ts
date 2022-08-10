import mongoose from 'mongoose';

import UserSchema from './schemas/user.schema.js';
import ItemSchema from './schemas/item.schema.js';

export const UserModel = mongoose.model('User', UserSchema);
export const ItemModel = mongoose.model('Item', ItemSchema);
