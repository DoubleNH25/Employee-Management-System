import { useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { ChatList } from '../../../components/Chat/ChatList';
import { ChatWindow } from '../../../components/Chat/ChatWindow';
import { SocketProvider } from '../../../context/SocketContext';

export const HRChatPage = () => {
    const HRState = useSelector((state) => state.HRReducer);
    const [selectedPartner, setSelectedPartner] = useState(null);
    const userDataRef = useRef(null);

    useEffect(() => {
        if (HRState.data?.data?.id) {
            userDataRef.current = {
                id: HRState.data.data.id,
                firstname: HRState.data.data.firstname,
                lastname: HRState.data.data.lastname,
                role: HRState.data.data.role || 'hr'
            };
        }
        else if (HRState.data?.id) {
            userDataRef.current = {
                id: HRState.data.id,
                firstname: HRState.data.firstname,
                lastname: HRState.data.lastname,
                role: HRState.data.role || 'hr'
            };
        }
    }, [HRState.data]);

    const currentUser = userDataRef.current || {
        id: undefined,
        firstname: undefined,
        lastname: undefined,
        role: 'hr'
    };

    return (
        <SocketProvider userRole="hr">
            <div className="chat-page-content w-full h-[94%] flex">
                {/* Chat List Sidebar */}
                <div className="w-80 h-full border-r">
                    <ChatList 
                        onSelectChat={setSelectedPartner}
                        currentUser={currentUser}
                    />
                </div>

                {/* Chat Window */}
                <div className="flex-1 h-full">
                    <ChatWindow
                        partner={selectedPartner}
                        currentUser={currentUser}
                        onClose={() => setSelectedPartner(null)}
                    />
                </div>
            </div>
        </SocketProvider>
    );
};
