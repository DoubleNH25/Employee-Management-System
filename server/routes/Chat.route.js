import express from "express";
import {
    HandleGetConversation,
    HandleGetUserConversations,
    HandleSaveMessage,
    HandleMarkMessagesAsRead,
    HandleGetUnreadCount,
    HandleGetChatEmployees
} from "../controllers/Chat.controller.js";
import { VerifyEmployeeToken, VerifyhHRToken } from "../middlewares/Auth.middleware.js";

const router = express.Router();

const verifyAnyUser = (req, res, next) => {
    const hrToken = req.cookies.HRtoken;
    const empToken = req.cookies.EMtoken;

    if (hrToken) {
        return VerifyhHRToken(req, res, next);
    } else if (empToken) {
        return VerifyEmployeeToken(req, res, next);
    } else {
        return res.status(401).json({
            success: false,
            message: "Unauthorized access"
        });
    }
};

router.get("/conversations", verifyAnyUser, HandleGetUserConversations);
router.get("/conversation/:partnerId", verifyAnyUser, HandleGetConversation);
router.post("/message", verifyAnyUser, HandleSaveMessage);
router.patch("/messages/read", verifyAnyUser, HandleMarkMessagesAsRead);
router.get("/unread-count", verifyAnyUser, HandleGetUnreadCount);

router.get("/employees", VerifyhHRToken, HandleGetChatEmployees);

export default router;
