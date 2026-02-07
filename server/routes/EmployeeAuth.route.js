import express from 'express'
import { HandleEmplyoeeSignup, HandleEmplyoeeVerifyEmail, HandleEmplyoeeLogout, HandleEmplyoeeLogin, HandleResetEmplyoeeVerifyEmail, HandleEmployeeCheck, HandleEmployeeCheckVerifyEmail, HandleRequestOTP, HandleVerifyOTPLogin } from '../controllers/EmplyoeeAuth.controller.js'
import { VerifyEmployeeToken } from '../middlewares/Auth.middleware.js'
import { VerifyhHRToken } from '../middlewares/Auth.middleware.js'
import { RoleAuthorization } from '../middlewares/RoleAuth.middleware.js'

const router = express.Router()

router.post("/signup", VerifyhHRToken, RoleAuthorization("HR-Admin"), HandleEmplyoeeSignup)

router.post("/verify-email", VerifyEmployeeToken, HandleEmplyoeeVerifyEmail)

router.post("/resend-verify-email", VerifyEmployeeToken, HandleResetEmplyoeeVerifyEmail)

router.post("/login", HandleEmplyoeeLogin)

router.post("/request-otp", HandleRequestOTP)
router.post("/verify-otp", HandleVerifyOTPLogin)

router.get("/check-login", VerifyEmployeeToken, HandleEmployeeCheck)

router.post("/logout", HandleEmplyoeeLogout)

router.get("/check-verify-email", VerifyEmployeeToken, HandleEmployeeCheckVerifyEmail) 


export default router