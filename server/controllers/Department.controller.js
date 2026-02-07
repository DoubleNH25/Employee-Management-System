import { Department } from "../models/firestore/Department.firestore.js"
import { Employee } from "../models/firestore/Employee.firestore.js"

export const HandleCreateDepartment = async (req, res) => {
    try {
        const { name, description } = req.body

        if (!name || !description) {
            return res.status(400).json({ success: false, message: "Name and description are required" })
        }

        const existingDepartment = await Department.findByNameInOrganization(name, req.ORGID)

        if (existingDepartment) {
            return res.status(400).json({ success: false, message: "Department with this name already exists" })
        }

        const newDepartment = await Department.createDepartment({
            name,
            description,
            organizationId: req.ORGID
        })

        return res.status(201).json({ 
            success: true, 
            type: "CreateDepartment",
            message: "Department created successfully", 
            data: newDepartment 
        })

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message })
    }
}

export const HandleAllDepartments = async (req, res) => {
    try {
        const departments = await Department.findByOrganization(req.ORGID)
        
        const departmentsWithDetails = await Promise.all(
            departments.map(async (department) => {
                const departmentWithDetails = { ...department }
                
                const employees = []
                if (department.employeeIds && department.employeeIds.length > 0) {
                    for (const empId of department.employeeIds) {
                        const employee = await Employee.findById(empId)
                        if (employee) {
                            employees.push({
                                id: employee.id,
                                firstname: employee.firstname,
                                lastname: employee.lastname,
                                email: employee.email,
                                contactnumber: employee.contactnumber
                            })
                        }
                    }
                }
                departmentWithDetails.employees = employees
                
                departmentWithDetails.notices = department.noticeIds || []
                departmentWithDetails.humanResources = department.humanResourceIds || []
                
                return departmentWithDetails
            })
        )

        return res.status(200).json({ success: true, message: "All departments retrieved successfully", data: departmentsWithDetails, type: "AllDepartments" })

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message, type: "AllDepartments" })
    }
}

export const HandleDepartment = async (req, res) => {
    try {
        const { departmentId } = req.params
        const departments = await Department.findByOrganization(req.ORGID)
        const department = departments.find(dept => dept.id === departmentId)

        if (!department) {
            return res.status(404).json({ success: false, message: "Department not found", type: "Department" })
        }

        const employees = []
        if (department.employeeIds && department.employeeIds.length > 0) {
            for (const empId of department.employeeIds) {
                const employee = await Employee.findById(empId)
                if (employee) {
                    employees.push({
                        id: employee.id,
                        firstname: employee.firstname,
                        lastname: employee.lastname,
                        email: employee.email,
                        contactnumber: employee.contactnumber
                    })
                }
            }
        }

        const departmentWithDetails = {
            ...department,
            employees: employees,
            notices: department.noticeIds || [],
            humanResources: department.humanResourceIds || []
        }

        return res.status(200).json({ success: true, message: "Department found", data: departmentWithDetails, type: "Department" })

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message, type: "Department" })
    }
}

export const HandleUpdateDepartment = async (req, res) => {
    try {
        const { departmentId } = req.params
        const { name, description } = req.body

        if (!departmentId) {
            return res.status(400).json({ success: false, message: "Department ID is required", type: "DepartmentUpdate" })
        }

        const departments = await Department.findByOrganization(req.ORGID)
        const department = departments.find(dept => dept.id === departmentId)

        if (!department) {
            return res.status(404).json({ success: false, message: "Department not found", type: "DepartmentUpdate" })
        }

        const updates = {}
        if (name) {
            const existingDepartment = await Department.findByNameInOrganization(name, req.ORGID)
            if (existingDepartment && existingDepartment.id !== departmentId) {
                return res.status(400).json({ success: false, message: "Department with this name already exists", type: "DepartmentUpdate" })
            }
            updates.name = name
        }
        if (description) updates.description = description

        const updatedDepartment = await Department.updateById(departmentId, updates)

        return res.status(200).json({ success: true, message: "Department updated successfully", data: updatedDepartment, type: "DepartmentUpdate" })

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message, type: "DepartmentUpdate" })
    }
}

export const HandleDeleteDepartment = async (req, res) => {
    try {
        const { departmentId } = req.params
        const departments = await Department.findByOrganization(req.ORGID)
        const department = departments.find(dept => dept.id === departmentId)

        if (!department) {
            return res.status(404).json({ success: false, message: "Department not found", type: "DepartmentDelete" })
        }

        if (department.employeeIds && department.employeeIds.length > 0) {
            for (const empId of department.employeeIds) {
                await Employee.updateById(empId, { departmentId: null })
            }
        }

        await Department.deleteById(departmentId)

        return res.status(200).json({ success: true, message: "Department deleted successfully", type: "DepartmentDelete" })

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message, type: "DepartmentDelete" })
    }
}

export const HandleAddEmployeesToDepartment = async (req, res) => {
    try {
        const { departmentID, employeeIDArray } = req.body

        if (!departmentID || !employeeIDArray || !Array.isArray(employeeIDArray)) {
            return res.status(400).json({ 
                success: false, 
                message: "Department ID and employee ID array are required", 
                type: "DepartmentEMUpdate" 
            })
        }

        const departments = await Department.findByOrganization(req.ORGID)
        const department = departments.find(dept => dept.id === departmentID)

        if (!department) {
            return res.status(404).json({ 
                success: false, 
                message: "Department not found", 
                type: "DepartmentEMUpdate" 
            })
        }

        for (const empId of employeeIDArray) {
            const employee = await Employee.findById(empId)
            if (employee && employee.organizationId === req.ORGID) {
                await Employee.updateById(empId, { departmentId: departmentID })
                
                if (!department.employeeIds.includes(empId)) {
                    await Department.addEmployee(departmentID, empId)
                }
            }
        }

        return res.status(200).json({ 
            success: true, 
            message: "Employees added to department successfully", 
            type: "DepartmentEMUpdate" 
        })

    } catch (error) {
        return res.status(500).json({ 
            success: false, 
            message: error.message, 
            type: "DepartmentEMUpdate" 
        })
    }
}

export const HandleRemoveEmployeeFromDepartment = async (req, res) => {
    try {
        const { departmentID, employeeIDArray } = req.body

        if (!departmentID || !employeeIDArray || !Array.isArray(employeeIDArray)) {
            return res.status(400).json({ 
                success: false, 
                message: "Department ID and employee ID array are required", 
                type: "RemoveEmployeeDE" 
            })
        }

        const departments = await Department.findByOrganization(req.ORGID)
        const department = departments.find(dept => dept.id === departmentID)

        if (!department) {
            return res.status(404).json({ 
                success: false, 
                message: "Department not found", 
                type: "RemoveEmployeeDE" 
            })
        }

        for (const empId of employeeIDArray) {
            const employee = await Employee.findById(empId)
            if (employee && employee.organizationId === req.ORGID) {
                await Employee.updateById(empId, { departmentId: null })
                
                await Department.removeEmployee(departmentID, empId)
            }
        }

        return res.status(200).json({ 
            success: true, 
            message: "Employees removed from department successfully", 
            type: "RemoveEmployeeDE" 
        })

    } catch (error) {
        return res.status(500).json({ 
            success: false, 
            message: error.message, 
            type: "RemoveEmployeeDE" 
        })
    }
}
