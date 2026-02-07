import { db } from '../../config/firebase.js';
import { FieldValue } from 'firebase-admin/firestore';

export class ChatMessage {
    constructor(data) {
        this.senderId = data.senderId;
        this.senderRole = data.senderRole;
        this.recipientId = data.recipientId;
        this.recipientRole = data.recipientRole;
        this.message = data.message;
        this.organizationId = data.organizationId;
        this.read = data.read || false;
        this.createdAt = data.createdAt || new Date();
    }

    static async create(messageData) {
        try {
            const message = new ChatMessage(messageData);
            const docRef = db.collection('chatMessages').doc();
            await docRef.set({
                ...message,
                createdAt: FieldValue.serverTimestamp()
            });
            
            return { id: docRef.id, ...message };
        } catch (error) {
            throw new Error(`Error creating message: ${error.message}`);
        }
    }

    static async getConversation(user1Id, user2Id, limit = 50) {
        try {
            const snapshot = await db.collection('chatMessages')
                .limit(200)
                .get();

            const messages = [];
            snapshot.docs.forEach(doc => {
                const data = doc.data();
                if ((data.senderId === user1Id && data.recipientId === user2Id) ||
                    (data.senderId === user2Id && data.recipientId === user1Id)) {
                    const messageData = { 
                        id: doc.id, 
                        ...data,
                        createdAt: data.createdAt?.toDate?.() || data.createdAt
                    };
                    messages.push(messageData);
                }
            });

            messages.sort((a, b) => {
                const aTime = a.createdAt instanceof Date ? a.createdAt.getTime() : (a.createdAt?.seconds || 0) * 1000;
                const bTime = b.createdAt instanceof Date ? b.createdAt.getTime() : (b.createdAt?.seconds || 0) * 1000;
                return aTime - bTime;
            });

            return messages.slice(-limit);
        } catch (error) {
            throw new Error(`Error getting conversation: ${error.message}`);
        }
    }

    static async getUserConversations(userId) {
        try {
            const snapshot = await db.collection('chatMessages')
                .limit(500)
                .get();

            const conversationsMap = new Map();

            snapshot.docs.forEach(doc => {
                const rawData = doc.data();
                const data = { 
                    id: doc.id, 
                    ...rawData,
                    createdAt: rawData.createdAt?.toDate?.() || rawData.createdAt
                };
                
                if (data.senderId === userId || data.recipientId === userId) {
                    const partnerId = data.senderId === userId ? data.recipientId : data.senderId;
                    const partnerRole = data.senderId === userId ? data.recipientRole : data.senderRole;

                    if (!conversationsMap.has(partnerId)) {
                        conversationsMap.set(partnerId, {
                            partnerId,
                            partnerRole,
                            lastMessage: data,
                            unreadCount: 0
                        });
                    } else {
                        const existing = conversationsMap.get(partnerId);
                        const existingTime = existing.lastMessage.createdAt instanceof Date 
                            ? existing.lastMessage.createdAt.getTime() 
                            : (existing.lastMessage.createdAt?.seconds || 0) * 1000;
                        const currentTime = data.createdAt instanceof Date 
                            ? data.createdAt.getTime() 
                            : (data.createdAt?.seconds || 0) * 1000;
                        if (currentTime > existingTime) {
                            existing.lastMessage = data;
                        }
                    }

                    if (data.recipientId === userId && !data.read) {
                        conversationsMap.get(partnerId).unreadCount++;
                    }
                }
            });

            return Array.from(conversationsMap.values());
        } catch (error) {
            throw new Error(`Error getting user conversations: ${error.message}`);
        }
    }

    static async markAsRead(messageIds) {
        try {
            const batch = db.batch();
            messageIds.forEach(messageId => {
                const docRef = db.collection('chatMessages').doc(messageId);
                batch.update(docRef, { read: true });
            });
            await batch.commit();
            return true;
        } catch (error) {
            throw new Error(`Error marking messages as read: ${error.message}`);
        }
    }

    static async delete(messageId) {
        try {
            await db.collection('chatMessages').doc(messageId).delete();
            return true;
        } catch (error) {
            throw new Error(`Error deleting message: ${error.message}`);
        }
    }

    static async getUnreadCount(userId) {
        try {
            const snapshot = await db.collection('chatMessages')
                .where('recipientId', '==', userId)
                .where('read', '==', false)
                .get();

            return snapshot.size;
        } catch (error) {
            throw new Error(`Error getting unread count: ${error.message}`);
        }
    }
}
