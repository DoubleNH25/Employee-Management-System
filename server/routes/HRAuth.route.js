import express from 'express'
import { HandleHRSignup, HandleHRVerifyEmail, HandleHRResetverifyEmail, HandleHRLogin, HandleHRCheck, HandleHRLogout, HandleHRcheckVerifyEmail, HandleSendOTP, HandleVerifyOTP } from '../controllers/HRAuth.controller.js'
import { VerifyhHRToken } from '../middlewares/Auth.middleware.js'
import { RoleAuthorization } from '../middlewares/RoleAuth.middleware.js'

const router = express.Router()

router.post("/signup", HandleHRSignup)

router.post("/verify-email", VerifyhHRToken, RoleAuthorization("HR-Admin"), HandleHRVerifyEmail)

router.post("/resend-verify-email", VerifyhHRToken, RoleAuthorization("HR-Admin"), HandleHRResetverifyEmail)

router.post("/login", HandleHRLogin)

router.get("/check-login", VerifyhHRToken, RoleAuthorization("HR-Admin"), HandleHRCheck)

router.get("/check-verify-email", VerifyhHRToken, RoleAuthorization("HR-Admin"), HandleHRcheckVerifyEmail)

router.post("/logout", HandleHRLogout)
router.post("/send-otp", HandleSendOTP)
router.post("/verify-otp", HandleVerifyOTP)

export default router
