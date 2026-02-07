import { HumanResources } from "../models/firestore/HR.firestore.js"
import { Organization } from "../models/firestore/Organization.firestore.js"
import bcrypt from 'bcrypt'
import { GenerateJwtTokenAndSetCookiesHR } from "../utils/generatejwttokenandsetcookies.js"
import { sendVerificationEmail, sendWelcomeEmail } from "../services/email.service.js"
import { GenerateVerificationToken } from "../utils/generateverificationtoken.js"

export const HandleHRSignup = async (req, res) => {
    try {
        const { firstname, lastname, email, password, contactnumber, name, description, OrganizationURL, OrganizationMail } = req.body

        if (!name || !description || !OrganizationURL || !OrganizationMail) {
            throw new Error("All Fields are required")
        }

        if (!firstname || !lastname || !email || !password || !contactnumber) {
            throw new Error("All Fields are required")
        }

        let organization = await Organization.findByName(name)
        if (!organization) {
            organization = await Organization.findByURL(OrganizationURL)
        }
        if (!organization) {
            organization = await Organization.findByEmail(OrganizationMail)
        }

        const HR = await HumanResources.findByEmail(email)

        if (HR) {
            return res.status(400).json({ success: false, message: "HR already exists, please go to the login page or create new HR", type: "signup" })
        }

        if (!organization && !HR) {
            const newOrganization = await Organization.createOrganization({
                name,
                description,
                OrganizationURL,
                OrganizationMail
            })

            const hashedpassword = await bcrypt.hash(password, 10)
            const verificationcode = GenerateVerificationToken(6)

            const newHR = await HumanResources.createHR({
                firstname,
                lastname,
                email,
                password: hashedpassword,
                contactnumber,
                role: "HR-Admin",
                organizationId: newOrganization.id,
                verificationtoken: verificationcode,
                verificationtokenexpires: new Date(Date.now() + 5 * 60 * 1000)
            })

            await Organization.addHR(newOrganization.id, newHR.id)

            GenerateJwtTokenAndSetCookiesHR(res, newHR.id, newHR.role, newOrganization.id)
            const VerificationEmailStatus = await sendVerificationEmail(email, verificationcode)
            return res.status(201).json({ success: true, message: "Organization Created Successfully & HR Registered Successfully", VerificationEmailStatus: VerificationEmailStatus, type: "signup", HRid: newHR.id })
        }

        if (organization && !HR) {
            const hashedpassword = await bcrypt.hash(password, 10)
            const verificationcode = GenerateVerificationToken(6)

            const newHR = await HumanResources.createHR({
                firstname,
                lastname,
                email,
                password: hashedpassword,
                contactnumber,
                role: "HR-Admin",
                organizationId: organization.id,
                verificationtoken: verificationcode,
                verificationtokenexpires: new Date(Date.now() + 5 * 60 * 1000)
            })

            await Organization.addHR(organization.id, newHR.id)

            GenerateJwtTokenAndSetCookiesHR(res, newHR.id, newHR.role, organization.id)
            const VerificationEmailStatus = await sendVerificationEmail(email, verificationcode)
            return res.status(201).json({ success: true, message: "HR Registered Successfully", type: "signup", VerificationEmailStatus: VerificationEmailStatus, HRid: newHR.id })
        }

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message, type: "signup" })
    }
}

export const HandleHRVerifyEmail = async (req, res) => {
    const { verificationcode } = req.body
    try {
        const HRs = await HumanResources.query([
            { field: 'verificationtoken', operator: '==', value: verificationcode },
            { field: 'organizationId', operator: '==', value: req.ORGID }
        ])

        const HR = HRs.find(hr => 
            hr.verificationtokenexpires && hr.verificationtokenexpires.toDate() > new Date()
        )

        if (!HR) {
            return res.status(401).json({ success: false, message: "Invalid or Expired Verifiation Code", type: "HRverifyemail" })
        }

        await HumanResources.updateById(HR.id, {
            isverified: true,
            verificationtoken: null,
            verificationtokenexpires: null
        })

        const SendWelcomeEmailStatus = await sendWelcomeEmail(HR.email, HR.firstname, HR.lastname)
        return res.status(200).json({ success: true, message: "Email Verified successfully", SendWelcomeEmailStatus: SendWelcomeEmailStatus, type: "HRverifyemail" })
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message, type: "HRverifyemail" })
    }
}

export const HandleHRLogin = async (req, res) => {
    const { email, password } = req.body
    try {
        const HR = await HumanResources.findByEmail(email)

        if (!HR) {
            return res.status(400).json({ success: false, message: "Invaild Credentials, Please Add Correct One", type: "HRLogin" })
        }

        const isMatch = await bcrypt.compare(password, HR.password)

        if (!isMatch) {
            return res.status(400).json({ success: false, message: "Invaild Credentials, Please Add Correct One", type: "HRLogin" })
        }

        GenerateJwtTokenAndSetCookiesHR(res, HR.id, HR.role, HR.organizationId)
        await HumanResources.updateLastLogin(HR.id)
        
        return res.status(200).json({ 
            success: true, 
            message: "HR Login Successfull", 
            type: "HRLogin",
            data: {
                id: HR.id,
                firstname: HR.firstname,
                lastname: HR.lastname,
                email: HR.email,
                role: HR.role,
                organizationId: HR.organizationId
            }
        })
    }
    catch (error) {
        return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message, type: "HRLogin" })
    }
}

export const HandleHRLogout = async (req, res) => {
    try {
        res.clearCookie("HRtoken")
        return res.status(200).json({ success: true, message: "HR Logged Out Successfully" })
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal server Error", error: error.message })
    }
}

export const HandleHRCheck = async (req, res) => {
    try {
        const HRs = await HumanResources.query([
            { field: 'organizationId', operator: '==', value: req.ORGID }
        ])
        
        const HR = HRs.find(hr => hr.id === req.HRid)
        
        if (!HR) {
            return res.status(404).json({ success: false, message: "HR not found", type: "checkHR" })
        }
        
        return res.status(200).json({ 
            success: true, 
            message: "HR Already Logged In", 
            type: "checkHR",
            data: {
                id: HR.id,
                firstname: HR.firstname,
                lastname: HR.lastname,
                email: HR.email,
                role: HR.role,
                organizationId: HR.organizationId
            }
        })
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message, message: "internal error", type: "checkHR" })
    }
}

export const HandleHRResetverifyEmail = async (req, res) => {
    const { email } = req.body
    try {
        const HRs = await HumanResources.query([
            { field: 'email', operator: '==', value: email },
            { field: 'organizationId', operator: '==', value: req.ORGID }
        ])

        const HR = HRs.find(hr => hr.id === req.HRid)

        if (!HR) {
            return res.status(404).json({ success: false, message: "HR Email Does Not Exist, Please Enter Correct Email", type: "HRResendVerifyEmail" })
        }

        if (HR.isverified) {
            return res.status(400).json({ success: false, message: "HR Email is already Verified", type: "HRResendVerifyEmail" })
        }

        const verificationcode = GenerateVerificationToken(6)
        await HumanResources.updateById(HR.id, {
            verificationtoken: verificationcode,
            verificationtokenexpires: new Date(Date.now() + 5 * 60 * 1000)
        })

        const SendVerificationEmailStatus = await sendVerificationEmail(email, verificationcode)
        return res.status(200).json({ success: true, message: "Verification Email Sent Successfully", SendVerificationEmailStatus: SendVerificationEmailStatus, type: "HRResendVerifyEmail" })

    }
    catch (error) {
        return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message })
    }
}

export const HandleHRcheckVerifyEmail = async (req, res) => {
    try {
        const HRs = await HumanResources.query([
            { field: 'organizationId', operator: '==', value: req.ORGID }
        ])
        
        const HR = HRs.find(hr => hr.id === req.HRid)

        if (!HR) {
            return res.status(404).json({ success: false, message: "HR not found", type: "HRcodeavailable" })
        }

        if (HR.isverified) {
            return res.status(200).json({ sucess: true, message: "HR Already Verified", type: "HRcodeavailable", alreadyverified: true })
        }

        if (HR.verificationtoken && HR.verificationtokenexpires && HR.verificationtokenexpires.toDate() > new Date()) {
            return res.status(200).json({ success: true, message: "Verification Code is Still Valid", type: "HRcodeavailable" })
        }

        return res.status(404).json({ success: false, message: "Invalid or Expired Verification Code", type: "HRcodeavailable" })
    }
    catch (error) {
        return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message, type: "HRcodeavailable" })
    }
}

import { sendOTPSMS, generateOTP, validatePhoneNumber } from "../services/sms.service.js"

export const HandleSendOTP = async (req, res) => {
    const { phone } = req.body
    
    try {
        if (!phone) {
            return res.status(400).json({ 
                success: false, 
                message: "Phone number is required", 
                type: "sendOTP" 
            })
        }

        if (!validatePhoneNumber(phone)) {
            return res.status(400).json({ 
                success: false, 
                message: "Invalid phone number format. Use international format (e.g., +84912345678)", 
                type: "sendOTP" 
            })
        }

        const HR = await HumanResources.findByContactNumber(phone)
        
        if (!HR) {
            return res.status(404).json({ 
                success: false, 
                message: "No account found with this phone number", 
                type: "sendOTP" 
            })
        }

        const otpCode = generateOTP()
        const otpExpires = new Date(Date.now() + 5 * 60 * 1000) 
        await HumanResources.updateOTP(HR.id, otpCode, otpExpires)

        const smsResult = await sendOTPSMS(phone, otpCode)

        if (!smsResult.success) {
            return res.status(500).json({ 
                success: false, 
                message: "Failed to send OTP. Please try again.", 
                error: smsResult.error,
                type: "sendOTP" 
            })
        }

        return res.status(200).json({ 
            success: true, 
            message: "OTP sent successfully to your phone", 
            type: "sendOTP",
            expiresIn: 300
        })

    } catch (error) {
        return res.status(500).json({ 
            success: false, 
            message: "Internal Server Error", 
            error: error.message, 
            type: "sendOTP" 
        })
    }
}

/**
 * Verify OTP and login
 * POST /api/auth/HR/verify-otp
 */
export const HandleVerifyOTP = async (req, res) => {
    const { phone, otpCode } = req.body
    
    try {
        if (!phone || !otpCode) {
            return res.status(400).json({ 
                success: false, 
                message: "Phone number and OTP code are required", 
                type: "verifyOTP" 
            })
        }

        const HR = await HumanResources.findByContactNumber(phone)
        
        if (!HR) {
            return res.status(404).json({ 
                success: false, 
                message: "No account found with this phone number", 
                type: "verifyOTP" 
            })
        }

        if (!HR.otpCode || !HR.otpExpires) {
            return res.status(400).json({ 
                success: false, 
                message: "No OTP found. Please request a new one.", 
                type: "verifyOTP" 
            })
        }

        const now = new Date()
        const expiresDate = HR.otpExpires.toDate ? HR.otpExpires.toDate() : new Date(HR.otpExpires)
        
        if (expiresDate < now) {
            return res.status(400).json({ 
                success: false, 
                message: "OTP has expired. Please request a new one.", 
                type: "verifyOTP" 
            })
        }

        if (HR.otpCode !== otpCode) {
            return res.status(400).json({ 
                success: false, 
                message: "Invalid OTP code", 
                type: "verifyOTP" 
            })
        }

        await HumanResources.clearOTP(HR.id)
        
        GenerateJwtTokenAndSetCookiesHR(res, HR.id, HR.role, HR.organizationId)
        
        await HumanResources.updateLastLogin(HR.id)

        return res.status(200).json({ 
            success: true, 
            message: "Login successful", 
            type: "verifyOTP",
            data: {
                id: HR.id,
                firstname: HR.firstname,
                lastname: HR.lastname,
                email: HR.email,
                contactnumber: HR.contactnumber,
                role: HR.role,
                organizationId: HR.organizationId
            }
        })

    } catch (error) {
        return res.status(500).json({ 
            success: false, 
            message: "Internal Server Error", 
            error: error.message, 
            type: "verifyOTP" 
        })
    }
}
