import { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext();

export const useSocket = () => {
    const context = useContext(SocketContext);
    if (!context) {
        throw new Error('useSocket must be used within SocketProvider');
    }
    return context;
};

export const SocketProvider = ({ children, userRole }) => {
    const [socket, setSocket] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    const [onlineUsers, setOnlineUsers] = useState(new Set());

    useEffect(() => {
        if (!userRole) {
            return;
        }

        const newSocket = io(import.meta.env.VITE_API_URL || 'http://localhost:3001', {
            withCredentials: true,
            transports: ['websocket', 'polling'],
            auth: (cb) => {
                cb({ role: userRole });
            }
        });

        newSocket.on('connect', () => {
            setIsConnected(true);
        });

        newSocket.on('disconnect', () => {
            setIsConnected(false);
        });

        newSocket.on('connect_error', (error) => {
            setIsConnected(false);
        });

        newSocket.on('user:online', (data) => {
            setOnlineUsers(prev => new Set([...prev, data.userId]));
        });

        newSocket.on('user:offline', (data) => {
            setOnlineUsers(prev => {
                const newSet = new Set(prev);
                newSet.delete(data.userId);
                return newSet;
            });
        });

        setSocket(newSocket);

        return () => {
            newSocket.close();
        };
    }, [userRole]);

    const value = {
        socket,
        isConnected,
        onlineUsers
    };

    return (
        <SocketContext.Provider value={value}>
            {children}
        </SocketContext.Provider>
    );
};
