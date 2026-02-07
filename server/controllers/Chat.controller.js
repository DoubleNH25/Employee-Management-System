import { ChatMessage } from "../models/firestore/ChatMessage.firestore.js";
import { Employee } from "../models/firestore/Employee.firestore.js";
import { HRModel } from "../models/firestore/HR.firestore.js";
import { db } from "../config/firebase.js";

const HR = new HRModel();

export const HandleGetConversation = async (req, res) => {
    try {
        const { partnerId } = req.params;
        const userId = req.HRid || req.EMid;

        const messages = await ChatMessage.getConversation(userId, partnerId);

        return res.status(200).json({
            success: true,
            data: messages,
            message: "Conversation retrieved successfully"
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: error.message,
            message: "Failed to retrieve conversation"
        });
    }
};

export const HandleGetUserConversations = async (req, res) => {
    try {
        const userId = req.HRid || req.EMid;
        const userRole = req.HRid ? 'hr' : 'employee';

        const conversations = await ChatMessage.getUserConversations(userId);

        const enrichedConversations = await Promise.all(
            conversations.map(async (conv) => {
                let partnerDetails = null;
                
                if (conv.partnerRole === 'hr') {
                    const hrDoc = await HR.findById(conv.partnerId);
                    if (hrDoc) {
                        partnerDetails = {
                            id: hrDoc.id,
                            firstname: hrDoc.firstname,
                            lastname: hrDoc.lastname,
                            email: hrDoc.email,
                            role: hrDoc.role
                        };
                    }
                } else {
                    const employee = await Employee.findById(conv.partnerId);
                    if (employee) {
                        partnerDetails = {
                            id: employee.id,
                            firstname: employee.firstname,
                            lastname: employee.lastname,
                            email: employee.email,
                            role: employee.role
                        };
                    }
                }

                return {
                    ...conv,
                    partnerDetails
                };
            })
        );

        return res.status(200).json({
            success: true,
            data: enrichedConversations,
            message: "Conversations retrieved successfully"
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: error.message,
            message: "Failed to retrieve conversations"
        });
    }
};

export const HandleSaveMessage = async (req, res) => {
    try {
        const { recipientId, recipientRole, message } = req.body;
        const senderId = req.HRid || req.EMid;
        const senderRole = req.HRid ? 'hr' : 'employee';
        const organizationId = req.ORGID;

        if (!recipientId || !message) {
            return res.status(400).json({
                success: false,
                message: "Recipient ID and message are required"
            });
        }

        const messageData = {
            senderId,
            senderRole,
            recipientId,
            recipientRole: recipientRole || 'employee',
            message,
            organizationId
        };

        const savedMessage = await ChatMessage.create(messageData);

        return res.status(201).json({
            success: true,
            data: savedMessage,
            message: "Message saved successfully"
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: error.message,
            message: "Failed to save message"
        });
    }
};

export const HandleMarkMessagesAsRead = async (req, res) => {
    try {
        const { messageIds, partnerId } = req.body;
        const userId = req.HRid || req.EMid;

        if (partnerId) {
            const snapshot = await db.collection('chatMessages')
                .where('recipientId', '==', userId)
                .where('senderId', '==', partnerId)
                .where('read', '==', false)
                .get();

            const batch = db.batch();
            snapshot.docs.forEach(doc => {
                batch.update(doc.ref, { read: true });
            });
            await batch.commit();

            return res.status(200).json({
                success: true,
                message: "Messages marked as read",
                count: snapshot.size
            });
        } else if (messageIds && Array.isArray(messageIds)) {
            await ChatMessage.markAsRead(messageIds);

            return res.status(200).json({
                success: true,
                message: "Messages marked as read"
            });
        } else {
            return res.status(400).json({
                success: false,
                message: "Either messageIds array or partnerId is required"
            });
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: error.message,
            message: "Failed to mark messages as read"
        });
    }
};

export const HandleGetUnreadCount = async (req, res) => {
    try {
        const userId = req.HRid || req.EMid;
        const count = await ChatMessage.getUnreadCount(userId);

        return res.status(200).json({
            success: true,
            data: { count },
            message: "Unread count retrieved successfully"
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: error.message,
            message: "Failed to retrieve unread count"
        });
    }
};

export const HandleGetChatEmployees = async (req, res) => {
    try {
        const organizationId = req.ORGID;
        
        const employees = await Employee.findByOrganization(organizationId);
        
        const employeeList = employees.map(emp => ({
            id: emp.id,
            firstname: emp.firstname,
            lastname: emp.lastname,
            email: emp.email,
            role: emp.role,
            departmentId: emp.departmentId
        }));

        return res.status(200).json({
            success: true,
            data: employeeList,
            message: "Employees retrieved successfully"
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: error.message,
            message: "Failed to retrieve employees"
        });
    }
};
