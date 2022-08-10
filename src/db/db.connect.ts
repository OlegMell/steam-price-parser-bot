import mongoose from 'mongoose';

const startDBConnect = async () => {
    return await mongoose.connect(process.env.DB_URL || '');
}

export default startDBConnect;
