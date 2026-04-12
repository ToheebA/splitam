import { Server as  HttpServer} from 'http';
import { Server } from 'socket.io';

let io: Server;

const setupSocket = (server: HttpServer) => {
    io = new Server(server, {
        cors: {
            origin: process.env.CLIENT_URL || 'http://localhost:5173',
            methods: ['GET', 'POST']
        }
    })

    io.on('connection', (socket) => {
        const { userId } = socket.handshake.query;
        if (!userId) {
            socket.disconnect();
            return;
        }
        console.log(`Client connected: ${userId}`);
        socket.join(userId);
        socket.on('disconnect', () => {
            console.log(`Client disconnected: ${userId}`);
        })
    })
}

const getIO = () => {
        if (!io) {
            throw new Error('Socket.io not initialized');
        }
        return io;
    };

export { setupSocket, getIO }