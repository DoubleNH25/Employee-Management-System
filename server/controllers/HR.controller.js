import { Department } from "../models/firestore/Department.firestore.js"
import { HumanResources } from "../models/firestore/HR.firestore.js"
import { Organization } from "../models/firestore/Organization.firestore.js"

export const HandleAllHR = async (req, res) => {
    try {
        const HRs = await HumanResources.findByOrganization(req.ORGID)
        
        const HRsWithDepartments = await Promise.all(
            HRs.map(async (hr) => {
                const hrWithDepartment = { ...hr }
                
                if (hr.departmentId) {
                    const department = await Department.findById(hr.departmentId)
                    hrWithDepartment.department = department ? {
                        id: department.id,
                        name: department.name,
                        description: department.description
                    } : null
                }
                
                return hrWithDepartment
            })
        )

        return res.status(200).json({ success: true, message: "All HR records retrieved successfully", data: HRsWithDepartments })
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message })
    }
}

export const HandleHR = async (req, res) => {
    try {
        const { HRID } = req.params
        const HRs = await HumanResources.findByOrganization(req.ORGID)
        const HR = HRs.find(hr => hr.id === HRID)

        if (!HR) {
            return res.status(404).json({ success: false, message: "HR record not found" })
        }

        const hrWithDepartment = { ...HR }
        
        if (HR.departmentId) {
            const department = await Department.findById(HR.departmentId)
            hrWithDepartment.department = department ? {
                id: department.id,
                name: department.name,
                description: department.description
            } : null
        }

        return res.status(200).json({ success: true, message: "HR record found", data: hrWithDepartment })
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message })
    }
}

export const HandleUpdateHR = async (req, res) => {
    try {
        const { HRID } = req.params
        const { firstname, lastname, email, contactnumber, department } = req.body

        if (!HRID) {
            return res.status(400).json({ success: false, message: "HR ID is required" })
        }

        const HRs = await HumanResources.findByOrganization(req.ORGID)
        const HR = HRs.find(hr => hr.id === HRID)

        if (!HR) {
            return res.status(404).json({ success: false, message: "HR record not found" })
        }

        const updates = {}
        if (firstname) updates.firstname = firstname
        if (lastname) updates.lastname = lastname
        if (email) updates.email = email
        if (contactnumber) updates.contactnumber = contactnumber
        if (department) updates.departmentId = department

        const updatedHR = await HumanResources.updateById(HRID, updates)

        return res.status(200).json({ success: true, message: "HR record updated successfully", data: updatedHR })

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message })
    }
}

export const HandleDeleteHR = async (req, res) => {
    try {
        const { HRID } = req.params

        if (!HRID) {
            return res.status(400).json({ success: false, message: "HR ID is required" })
        }

        const HRs = await HumanResources.findByOrganization(req.ORGID)
        const HR = HRs.find(hr => hr.id === HRID)

        if (!HR) {
            return res.status(404).json({ success: false, message: "HR record not found" })
        }

        await Organization.removeHR(req.ORGID, HRID)

        if (HR.departmentId) {
            await Department.removeHR(HR.departmentId, HRID)
        }

        await HumanResources.deleteById(HRID)

        return res.status(200).json({ success: true, message: "HR record deleted successfully" })

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message })
    }
}

export const HandleGetMyProfile = async (req, res) => {
    try {
        const HRs = await HumanResources.findByOrganization(req.ORGID)
        const HR = HRs.find(hr => hr.id === req.HRid)

        if (!HR) {
            return res.status(404).json({ success: false, message: "HR profile not found" })
        }

        const hrProfile = { ...HR }
        
        if (HR.departmentId) {
            const department = await Department.findById(HR.departmentId)
            hrProfile.department = department ? {
                id: department.id,
                name: department.name,
                description: department.description
            } : null
        }

        return res.status(200).json({ success: true, message: "Profile retrieved successfully", data: hrProfile })
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message })
    }
}

export const HandleUpdateMyProfile = async (req, res) => {
    try {
        const { firstname, lastname, email, contactnumber, departmentId } = req.body

        const HRs = await HumanResources.findByOrganization(req.ORGID)
        const HR = HRs.find(hr => hr.id === req.HRid)

        if (!HR) {
            return res.status(404).json({ success: false, message: "HR profile not found" })
        }

        if (email && email !== HR.email) {
            const existingHR = await HumanResources.findByEmail(email)
            if (existingHR && existingHR.id !== req.HRid) {
                return res.status(400).json({ success: false, message: "Email already exists" })
            }
        }

        const updates = {}
        if (firstname) updates.firstname = firstname
        if (lastname) updates.lastname = lastname
        if (email) updates.email = email
        if (contactnumber) updates.contactnumber = contactnumber
        if (departmentId !== undefined) updates.departmentId = departmentId

        const updatedHR = await HumanResources.updateById(req.HRid, updates)

        return res.status(200).json({ success: true, message: "Profile updated successfully", data: updatedHR })

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message })
    }
}