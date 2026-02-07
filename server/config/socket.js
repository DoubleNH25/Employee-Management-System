import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import { ChatMessage } from '../models/firestore/ChatMessage.firestore.js';

let io;

export const initializeSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: process.env.CLIENT_URL || "http://localhost:5173",
            credentials: true,
            methods: ["GET", "POST"]
        }
    });

    const connectedUsers = new Map();
    const userRoles = new Map();

    io.use((socket, next) => {
        const role = socket.handshake.auth.role;

        if (!role) {
            return next(new Error('Authentication error: No role provided'));
        }

        const cookies = socket.handshake.headers.cookie;
        if (!cookies) {
            return next(new Error('Authentication error: No cookies found'));
        }

        const cookieObj = {};
        cookies.split(';').forEach(cookie => {
            const [key, value] = cookie.trim().split('=');
            cookieObj[key] = value;
        });

        const token = role === 'hr' ? cookieObj.HRtoken : cookieObj.EMtoken;

        if (!token) {
            return next(new Error(`Authentication error: No ${role} token found`));
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            socket.userId = role === 'hr' ? decoded.HRid : decoded.EMid;
            socket.userRole = role;
            socket.organizationId = decoded.ORGID;
            next();
        } catch (error) {
            return next(new Error('Authentication error: Invalid token'));
        }
    });

    io.on('connection', (socket) => {
        connectedUsers.set(socket.userId, socket.id);
        userRoles.set(socket.id, { userId: socket.userId, role: socket.userRole });

        socket.join(`user:${socket.userId}`);
        socket.join(`org:${socket.organizationId}`);

        socket.broadcast.emit('user:online', {
            userId: socket.userId,
            role: socket.userRole
        });

        socket.on('message:send', async (data) => {
            const { recipientId, message, recipientRole } = data;

            try {
                const messageData = {
                    senderId: socket.userId,
                    senderRole: socket.userRole,
                    recipientId,
                    recipientRole,
                    message,
                    organizationId: socket.organizationId
                };

                const savedMessage = await ChatMessage.create(messageData);

                const socketMessageData = {
                    id: savedMessage.id,
                    senderId: socket.userId,
                    senderRole: socket.userRole,
                    recipientId,
                    recipientRole,
                    message,
                    createdAt: new Date(),
                    read: false
                };

                const recipientSocketId = connectedUsers.get(recipientId);
                if (recipientSocketId) {
                    io.to(recipientSocketId).emit('message:receive', socketMessageData);
                }

                socket.emit('message:sent', socketMessageData);
            } catch (error) {
                socket.emit('message:error', { error: 'Failed to save message' });
            }
        });

        socket.on('typing:start', (data) => {
            const { recipientId } = data;
            const recipientSocketId = connectedUsers.get(recipientId);
            if (recipientSocketId) {
                io.to(recipientSocketId).emit('typing:start', {
                    userId: socket.userId,
                    role: socket.userRole
                });
            }
        });

        socket.on('typing:stop', (data) => {
            const { recipientId } = data;
            const recipientSocketId = connectedUsers.get(recipientId);
            if (recipientSocketId) {
                io.to(recipientSocketId).emit('typing:stop', {
                    userId: socket.userId,
                    role: socket.userRole
                });
            }
        });

        socket.on('message:read', (data) => {
            const { messageId, senderId } = data;
            const senderSocketId = connectedUsers.get(senderId);
            if (senderSocketId) {
                io.to(senderSocketId).emit('message:read', {
                    messageId,
                    readBy: socket.userId
                });
            }
        });

        socket.on('messages:read', (data) => {
            const { partnerId } = data;
            const partnerSocketId = connectedUsers.get(partnerId);
            if (partnerSocketId) {
                io.to(partnerSocketId).emit('messages:read', {
                    readBy: socket.userId
                });
            }
        });

        socket.on('disconnect', () => {
            connectedUsers.delete(socket.userId);
            userRoles.delete(socket.id);

            socket.broadcast.emit('user:offline', {
                userId: socket.userId,
                role: socket.userRole
            });
        });

        socket.on('error', (error) => {
            console.error('Socket error:', error);
        });
    });

    return io;
};

export const getIO = () => {
    if (!io) {
        throw new Error('Socket.io not initialized');
    }
    return io;
};
