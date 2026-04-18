import 'dotenv/config';
import express from 'express';
import 'express-async-errors';
import cors from 'cors';
import { createServer } from 'http';
import connectDB from './db/connect';
import { setupSocket } from './config/socket';
import errorHandler from './middleware/errorHandler';
import authRouter from './routes/auth';
import productRouter from './routes/product';
import groupRouter from './routes/group';

const app = express();
const server = createServer(app);

app.use(cors({
    origin: [
        process.env.CLIENT_URL || 'http://localhost:5173',
        // Add other allowed origins here
    ]
}));
app.use(express.json());

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/products', productRouter);
app.use('/api/v1/groups', groupRouter);
app.get('/', (_req, res) => {
    res.json({ msg: 'SplitAm API' })
})

app.use(errorHandler);

const port = process.env.PORT || 5000;

const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI as string);
        setupSocket(server);
        server.listen(port, () => {
            console.log(`Server is listening on port ${port}...`)
        });
    } catch (error) {
        console.log(error);
    }
};

start();