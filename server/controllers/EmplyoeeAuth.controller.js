import { Employee } from "../models/firestore/Employee.firestore.js"
import { Organization } from "../models/firestore/Organization.firestore.js"
import bcrypt from 'bcrypt'
import { GenerateVerificationToken } from "../utils/generateverificationtoken.js"
import { sendVerificationEmail, sendWelcomeEmail, sendOTPEmail } from "../services/email.service.js"
import { GenerateJwtTokenAndSetCookiesEmployee } from "../utils/generatejwttokenandsetcookies.js"

export const HandleEmplyoeeSignup = async (req, res) => {
    const { firstname, lastname, email, password, contactnumber } = req.body
    try {
        if (!firstname || !lastname || !email || !password || !contactnumber) {
            throw new Error("All Fields are required")
        }

        const organization = await Organization.findById(req.ORGID)

        if (!organization) {
            return res.status(404).json({ success: false, message: "Organization or Company not found" })
        }

        try {
            const hashedPassword = await bcrypt.hash(password, 10)
            const verificationcode = GenerateVerificationToken(6)

            const newEmployee = await Employee.createEmployee({
                firstname: firstname,
                lastname: lastname,
                email: email,
                password: hashedPassword,
                contactnumber: contactnumber,
                role: "Employee",
                verificationtoken: verificationcode,
                verificationtokenexpires: new Date(Date.now() + 5 * 60 * 1000),
                organizationId: organization.id
            })

            await Organization.addEmployee(organization.id, newEmployee.id)

            return res.status(201).json({ success: true, message: "Employee Registered Successfully", newEmployee: newEmployee.email, type: "EmployeeCreate" })

        } catch (error) {
            res.status(400).json({ success: false, message: "Oops! Something went wrong", error: error.message });
        }

    } catch (error) {
        res.status(400).json({ success: false, message: "All Fields are required" })
    }
}

export const HandleEmplyoeeVerifyEmail = async (req, res) => {
    const { verificationcode } = req.body

    try {
        const employees = await Employee.query([
            { field: 'verificationtoken', operator: '==', value: verificationcode },
            { field: 'organizationId', operator: '==', value: req.ORGID }
        ])

        const ValidateEmployee = employees.find(emp => 
            emp.verificationtokenexpires && emp.verificationtokenexpires.toDate() > new Date()
        )

        if (!ValidateEmployee) {
            return res.status(404).json({ success: false, message: "Invalid or Expired Verifiation Code" })
        }

        await Employee.updateById(ValidateEmployee.id, {
            isverified: true,
            verificationtoken: null,
            verificationtokenexpires: null
        })

        const SendWelcomeEmailStatus = await sendWelcomeEmail(ValidateEmployee.email, ValidateEmployee.firstname, ValidateEmployee.lastname)

        return res.status(200).json({ success: true, message: "Employee Email verified successfully", validatedEmployee: ValidateEmployee, SendWelcomeEmailStatus: SendWelcomeEmailStatus })

    } catch (error) {
        res.status(500).json({ success: false, message: "Internal Server Error", error: error.message })
    }
}

export const HandleResetEmplyoeeVerifyEmail = async (req, res) => {
    const { email } = req.body

    try {
        const employee = await Employee.findByEmail(email)

        if (!employee) {
            return res.status(404).json({ success: false, message: "Employee Email Does Not Exist, Please Enter Valid Email Address" })
        }

        if (employee.isverified) {
            return res.status(404).json({ success: false, message: "Employee Email Already verified" })
        }

        const verificationcode = GenerateVerificationToken(6)
        await Employee.updateById(employee.id, {
            verificationtoken: verificationcode,
            verificationtokenexpires: new Date(Date.now() + 5 * 60 * 1000)
        })

        const SendVerificationEmailStatus = await sendVerificationEmail(email, verificationcode)
        return res.status(200).json({ success: true, message: "Verification email sent successfully", SendVerificationEmailStatus: SendVerificationEmailStatus })

    } catch (error) {
        res.status(500).json({ success: false, message: "internal error", error: error.message })
    }
}

export const HandleRequestOTP = async (req, res) => {
    const { email } = req.body
    try {
        const employee = await Employee.findByEmail(email)

        if (!employee) {
            return res.status(404).json({ success: false, message: "Employee not found with this email" })
        }

        const otp = GenerateVerificationToken(6)
        const otpExpires = new Date(Date.now() + 10 * 60 * 1000)

        await Employee.updateById(employee.id, {
            loginOTP: otp,
            loginOTPExpires: otpExpires
        })

        const sendOTPStatus = await sendOTPEmail(email, otp, `${employee.firstname} ${employee.lastname}`)
        
        if (!sendOTPStatus.success) {
            return res.status(500).json({ success: false, message: "Failed to send OTP email" })
        }

        return res.status(200).json({ 
            success: true, 
            message: "OTP sent to your email successfully",
            expiresIn: "10 minutes"
        })

    } catch (error) {
        res.status(500).json({ success: false, message: "Internal server error", error: error.message })
    }
}

export const HandleVerifyOTPLogin = async (req, res) => {
    const { email, otp } = req.body
    try {
        const employee = await Employee.findByEmail(email)

        if (!employee) {
            return res.status(404).json({ success: false, message: "Employee not found" })
        }

        if (!employee.loginOTP || !employee.loginOTPExpires) {
            return res.status(400).json({ success: false, message: "No OTP request found. Please request a new OTP" })
        }

        if (employee.loginOTPExpires.toDate() < new Date()) {
            return res.status(400).json({ success: false, message: "OTP has expired. Please request a new one" })
        }

        if (employee.loginOTP !== otp) {
            return res.status(400).json({ success: false, message: "Invalid OTP code" })
        }

        await Employee.updateById(employee.id, {
            loginOTP: null,
            loginOTPExpires: null
        })

        GenerateJwtTokenAndSetCookiesEmployee(res, employee.id, employee.role, employee.organizationId)
        await Employee.updateLastLogin(employee.id)

        return res.status(200).json({ success: true, message: "Login successful" })

    } catch (error) {
        res.status(500).json({ success: false, message: "Internal server error", error: error.message })
    }
}

export const HandleEmplyoeeLogin = async (req, res) => {
    const { email, password } = req.body
    try {
        const employee = await Employee.findByEmail(email)

        if (!employee) {
            return res.status(404).json({ success: false, message: "Invalid Credentials, Please Enter Correct One" })
        }

        const isMatch = await bcrypt.compare(password, employee.password)

        if (!isMatch) {
            return res.status(404).json({ success: false, message: "Invalid Credentials, Please Enter Correct One" })
        }

        GenerateJwtTokenAndSetCookiesEmployee(res, employee.id, employee.role, employee.organizationId)
        
        await Employee.updateLastLogin(employee.id)

        return res.status(200).json({ success: true, message: "Emplyoee Login Successfull" })

    } catch (error) {
        res.status(500).json({ success: false, message: "Internal Server Error", error: error.message })
    }
}

export const HandleEmployeeCheck = async (req, res) => {
    try {
        const employees = await Employee.query([
            { field: 'organizationId', operator: '==', value: req.ORGID }
        ])
        
        const employee = employees.find(emp => emp.id === req.EMid)
        
        if (!employee) {
            return res.status(404).json({ success: false, message: "Employee not found" })
        }
        return res.status(200).json({ success: true, message: "Employee Already Logged In" })
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message, message: "internal error" })
    }
}

export const HandleEmplyoeeLogout = async (req, res) => {
    try {
        res.clearCookie("EMtoken")
        return res.status(200).json({ success: true, message: "Logged out successfully" })
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal server Error" })
    }
}

export const HandleEmployeeCheckVerifyEmail = async (req, res) => {
    try {
        const employees = await Employee.query([
            { field: 'organizationId', operator: '==', value: req.ORGID }
        ])
        
        const employee = employees.find(emp => emp.id === req.EMid)

        if (!employee) {
            return res.status(404).json({ success: false, message: "Employee not found", type: "Employeecodeavailable" })
        }

        if (employee.isverified) {
            return res.status(200).json({ success: false, message: "Employee Already Verified", type: "Employeecodeavailable" })
        }

        if (employee.verificationtoken && employee.verificationtokenexpires && employee.verificationtokenexpires.toDate() > new Date()) {
            return res.status(200).json({ success: true, message: "Verification Code is Still Valid", type: "Employeecodeavailable" })
        }

        return res.status(200).json({ success: false, message: "Invalid or Expired Verification Code", type: "Employeecodeavailable" })

    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message })
    }
}