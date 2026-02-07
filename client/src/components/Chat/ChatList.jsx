import { useState, useEffect } from 'react';
import { useSocket } from '../../context/SocketContext';

export const ChatList = ({ onSelectChat, currentUser }) => {
    const { onlineUsers, socket } = useSocket();
    const [conversations, setConversations] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        loadData();
    }, []);

    useEffect(() => {
        if (!socket) return;

        const handleNewMessage = () => {
            loadData();
        };

        socket.on('message:receive', handleNewMessage);
        socket.on('message:sent', handleNewMessage);

        return () => {
            socket.off('message:receive', handleNewMessage);
            socket.off('message:sent', handleNewMessage);
        };
    }, [socket]);

    const loadData = async () => {
        setIsLoading(true);
        try {
            const convResponse = await fetch('http://localhost:3001/api/v1/chat/conversations', {
                credentials: 'include'
            });
            const convData = await convResponse.json();
            
            if (convData.success) {
                setConversations(convData.data);
            }

            if (currentUser.role === 'hr' || currentUser.role === 'HR-Manager' || currentUser.role === 'HR-Admin') {
                const empResponse = await fetch('http://localhost:3001/api/v1/chat/employees', {
                    credentials: 'include'
                });
                const empData = await empResponse.json();
                
                if (empData.success) {
                    setEmployees(empData.data);
                }
            }
        } catch (error) {
            console.error('Error loading chat data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const formatLastMessage = (message) => {
        if (!message) return 'No messages yet';
        return message.length > 50 ? message.substring(0, 50) + '...' : message;
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
        
        const now = new Date();
        const diff = now - date;
        const hours = Math.floor(diff / (1000 * 60 * 60));
        
        if (hours < 24) {
            return date.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit'
            });
        } else {
            return date.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric'
            });
        }
    };
    const allChats = [...conversations];
    
    if (currentUser.role === 'hr' || currentUser.role === 'HR-Manager' || currentUser.role === 'HR-Admin') {
        const conversationPartnerIds = new Set(conversations.map(c => c.partnerId));
        const newEmployees = employees
            .filter(emp => !conversationPartnerIds.has(emp.id))
            .map(emp => ({
                partnerId: emp.id,
                partnerRole: 'employee',
                partnerDetails: emp,
                lastMessage: null,
                unreadCount: 0
            }));
        
        allChats.push(...newEmployees);
    }

    const filteredChats = allChats.filter(chat => {
        if (!searchQuery) return true;
        const name = `${chat.partnerDetails?.firstname} ${chat.partnerDetails?.lastname}`.toLowerCase();
        return name.includes(searchQuery.toLowerCase());
    });

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full bg-white border-r">
            {/* Header */}
            <div className="px-4 py-4 border-b">
                <h2 className="text-xl font-bold text-gray-900 mb-3">Messages</h2>
                <input
                    type="text"
                    placeholder="Search conversations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            {/* Chat List */}
            <div className="flex-1 overflow-y-auto">
                {filteredChats.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full p-4 text-center">
                        <svg className="w-16 h-16 text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        <p className="text-gray-500">No conversations yet</p>
                        <p className="text-sm text-gray-400 mt-1">
                            {currentUser.role === 'hr' || currentUser.role === 'HR-Manager' 
                                ? 'Select an employee to start chatting' 
                                : 'Wait for HR to message you'}
                        </p>
                    </div>
                ) : (
                    filteredChats.map((chat) => {
                        const partner = chat.partnerDetails;
                        if (!partner) return null;

                        const isOnline = onlineUsers.has(partner.id);

                        return (
                            <button
                                key={chat.partnerId}
                                onClick={() => onSelectChat(partner)}
                                className="w-full px-4 py-3 hover:bg-gray-50 border-b transition-colors text-left"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="relative">
                                        <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
                                            {partner.firstname?.[0]}{partner.lastname?.[0]}
                                        </div>
                                        {isOnline && (
                                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between mb-1">
                                            <h3 className={`truncate ${chat.unreadCount > 0 ? 'font-bold text-gray-900' : 'font-semibold text-gray-900'}`}>
                                                {partner.firstname} {partner.lastname}
                                            </h3>
                                            {chat.lastMessage && (
                                                <span className="text-xs text-gray-500">
                                                    {formatTime(chat.lastMessage.createdAt || chat.lastMessage.timestamp)}
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <p className={`text-sm truncate ${chat.unreadCount > 0 ? 'font-semibold text-gray-900' : 'text-gray-500'}`}>
                                                {chat.lastMessage 
                                                    ? formatLastMessage(chat.lastMessage.message)
                                                    : 'Start a conversation'}
                                            </p>
                                            {chat.unreadCount > 0 && (
                                                <span className="ml-2 px-2 py-1 bg-blue-600 text-white text-xs rounded-full min-w-[20px] text-center">
                                                    {chat.unreadCount}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </button>
                        );
                    })
                )}
            </div>
        </div>
    );
};
