import mongoose from 'mongoose';
import dns from 'node:dns/promises'
dns.setServers(['1.1.1.1', '8.8.8.8'])

const connectDB = (url: string) => {
    return mongoose.connect(url);
};

export default connectDB