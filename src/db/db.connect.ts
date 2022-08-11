import mongoose from 'mongoose';

const startDBConnect = async (): Promise<typeof mongoose> => {
    return await mongoose.connect(process.env.DB_URL!, { dbName: process.env.DB_NAME });
}

export default startDBConnect;
