import { useState, useEffect, useRef } from 'react';
import { useSocket } from '../../context/SocketContext';
import { useToast } from '../../hooks/use-toast';

export const ChatWindow = ({ partner, currentUser, onClose }) => {
    const { socket, isConnected } = useSocket();
    const { toast } = useToast();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const messagesEndRef = useRef(null);
    const typingTimeoutRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        if (partner?.id) {
            loadConversation();
            markConversationAsRead(partner.id);
        }
    }, [partner?.id]);

    const loadConversation = async () => {
        try {
            const response = await fetch(`http://localhost:3001/api/v1/chat/conversation/${partner.id}`, {
                credentials: 'include'
            });
            const data = await response.json();
            if (data.success) {
                setMessages(data.data);
            }
        } catch (error) {
            console.error('Error loading conversation:', error);
        }
    };

    const markConversationAsRead = async (partnerId) => {
        try {
            await fetch('http://localhost:3001/api/v1/chat/messages/read', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({ partnerId })
            });
            
            if (socket) {
                socket.emit('messages:read', { partnerId });
            }
        } catch (error) {
            console.error('Error marking messages as read:', error);
        }
    };

    useEffect(() => {
        if (!socket) return;

        socket.on('message:receive', (message) => {
            if (message.senderId === partner.id) {
                setMessages(prev => [...prev, message]);
                markConversationAsRead(partner.id);
            }
        });

        socket.on('message:sent', (message) => {
            setMessages(prev => [...prev, message]);
        });

        socket.on('messages:read', (data) => {
            if (data.readBy === partner.id) {
                setMessages(prev => prev.map(msg => 
                    msg.senderId === currentUser.id && msg.recipientId === partner.id
                        ? { ...msg, read: true }
                        : msg
                ));
            }
        });

        socket.on('typing:start', (data) => {
            if (data.userId === partner.id) {
                setIsTyping(true);
            }
        });

        socket.on('typing:stop', (data) => {
            if (data.userId === partner.id) {
                setIsTyping(false);
            }
        });

        return () => {
            socket.off('message:receive');
            socket.off('message:sent');
            socket.off('messages:read');
            socket.off('typing:start');
            socket.off('typing:stop');
        };
    }, [socket, partner?.id, currentUser.id]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        
        if (!newMessage.trim() || !socket || !isConnected) return;

        setIsSending(true);
        
        try {
            socket.emit('message:send', {
                recipientId: partner.id,
                recipientRole: partner.role || 'employee',
                message: newMessage.trim()
            });

            setNewMessage('');
            
            socket.emit('typing:stop', { recipientId: partner.id });
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to send message",
                variant: "destructive"
            });
        } finally {
            setIsSending(false);
        }
    };

    const handleTyping = (e) => {
        setNewMessage(e.target.value);

        if (!socket) return;

        socket.emit('typing:start', { recipientId: partner.id });

        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }

        typingTimeoutRef.current = setTimeout(() => {
            socket.emit('typing:stop', { recipientId: partner.id });
        }, 2000);
    };

    const formatTime = (timestamp) => {
        if (!timestamp) return '';
        
        let date;
        if (timestamp.seconds) {
            date = new Date(timestamp.seconds * 1000);
        } 
        else if (typeof timestamp === 'string' || timestamp instanceof Date) {
            date = new Date(timestamp);
        }
        else {
            return '';
        }
        
        if (isNaN(date.getTime())) {
            return '';
        }
        
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (!partner) {
        return (
            <div className="flex items-center justify-center h-full bg-gray-50">
                <p className="text-gray-500">Select a conversation to start chatting</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full bg-white">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b bg-white">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
                        {partner.firstname?.[0]}{partner.lastname?.[0]}
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-900">
                            {partner.firstname} {partner.lastname}
                        </h3>
                        <p className="text-sm text-gray-500">{partner.role}</p>
                    </div>
                </div>
                <button
                    onClick={onClose}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.length === 0 ? (
                    <div className="flex items-center justify-center h-full">
                        <p className="text-gray-400">No messages yet. Start the conversation!</p>
                    </div>
                ) : (
                    messages.map((msg, index) => {
                        const isOwn = msg.senderId === currentUser.id;
                        return (
                            <div
                                key={msg.id || index}
                                className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                            >
                                <div className={`max-w-[70%] ${isOwn ? 'order-2' : 'order-1'}`}>
                                    <div
                                        className={`px-4 py-2 rounded-lg ${
                                            isOwn
                                                ? 'bg-blue-600 text-white'
                                                : 'bg-gray-100 text-gray-900'
                                        }`}
                                    >
                                        <p className="break-words">{msg.message}</p>
                                    </div>
                                    <div className={`flex items-center gap-1 mt-1 ${isOwn ? 'justify-end' : 'justify-start'}`}>
                                        <p className="text-xs text-gray-500">
                                            {formatTime(msg.createdAt || msg.timestamp)}
                                        </p>
                                        {isOwn && (
                                            <span className="text-xs">
                                                {msg.read ? (
                                                    <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                        <path fillRule="evenodd" d="M14.707 5.293a1 1 0 010 1.414l-6 6a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L8 10.586l5.293-5.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                    </svg>
                                                ) : (
                                                    <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                    </svg>
                                                )}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
                {isTyping && (
                    <div className="flex justify-start">
                        <div className="bg-gray-100 px-4 py-2 rounded-lg">
                            <div className="flex gap-1">
                                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                            </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSendMessage} className="px-6 py-4 border-t bg-white">
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={handleTyping}
                        placeholder="Type a message..."
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={!isConnected || isSending}
                    />
                    <button
                        type="submit"
                        disabled={!newMessage.trim() || !isConnected || isSending}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                    >
                        {isSending ? (
                            <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                        ) : (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                            </svg>
                        )}
                    </button>
                </div>
                {!isConnected && (
                    <p className="text-xs text-red-500 mt-2">Disconnected. Trying to reconnect...</p>
                )}
            </form>
        </div>
    );
};
