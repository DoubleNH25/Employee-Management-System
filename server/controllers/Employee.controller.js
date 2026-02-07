import { Department } from "../models/firestore/Department.firestore.js" 
import { Employee } from "../models/firestore/Employee.firestore.js"
import { Organization } from "../models/firestore/Organization.firestore.js"

export const HandleAllEmployees = async (req, res) => {
    try {
        const employees = await Employee.findByOrganization(req.ORGID)
        
        const employeesWithDepartments = await Promise.all(
            employees.map(async (employee) => {
                const employeeWithDepartment = {
                    id: employee.id,
                    firstname: employee.firstname,
                    lastname: employee.lastname,
                    email: employee.email,
                    contactnumber: employee.contactnumber,
                    departmentId: employee.departmentId,
                    attendanceId: employee.attendanceId,
                    noticeIds: employee.noticeIds || [],
                    salaryIds: employee.salaryIds || [],
                    leaverequestIds: employee.leaverequestIds || [],
                    generaterequestIds: employee.generaterequestIds || [],
                    isverified: employee.isverified
                }
                
                if (employee.departmentId) {
                    const department = await Department.findById(employee.departmentId)
                    employeeWithDepartment.department = department ? {
                        id: department.id,
                        name: department.name
                    } : null
                }
                
                return employeeWithDepartment
            })
        )

        return res.status(200).json({ success: true, data: employeesWithDepartments, type: "AllEmployees" })
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message, type: "AllEmployees" })
    }
}

export const HandleAllEmployeesIDS = async (req, res) => {
    try {
        const employees = await Employee.findByOrganization(req.ORGID)
        
        const employeesWithDepartments = await Promise.all(
            employees.map(async (employee) => {
                const employeeData = {
                    id: employee.id,
                    firstname: employee.firstname,
                    lastname: employee.lastname,
                    departmentId: employee.departmentId
                }
                
                if (employee.departmentId) {
                    const department = await Department.findById(employee.departmentId)
                    employeeData.department = department ? {
                        id: department.id,
                        name: department.name
                    } : null
                }
                
                return employeeData
            })
        )

        return res.status(200).json({ success: true, data: employeesWithDepartments, type: "AllEmployeesIDS" })
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message, type: "AllEmployeesIDS" })
    }
}

export const HandleEmployee = async (req, res) => {
    try {
        const { employeeId } = req.params
        const employees = await Employee.findByOrganization(req.ORGID)
        const employee = employees.find(emp => emp.id === employeeId)

        if (!employee) {
            return res.status(404).json({ success: false, message: "Employee not found", type: "Employee" })
        }

        const employeeWithDetails = {
            id: employee.id,
            firstname: employee.firstname,
            lastname: employee.lastname,
            email: employee.email,
            contactnumber: employee.contactnumber,
            departmentId: employee.departmentId,
            attendanceId: employee.attendanceId,
            noticeIds: employee.noticeIds || [],
            salaryIds: employee.salaryIds || [],
            leaverequestIds: employee.leaverequestIds || [],
            generaterequestIds: employee.generaterequestIds || []
        }

        if (employee.departmentId) {
            const department = await Department.findById(employee.departmentId)
            employeeWithDetails.department = department ? {
                id: department.id,
                name: department.name
            } : null
        }

        return res.status(200).json({ success: true, data: employeeWithDetails, type: "Employee" })
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message, type: "Employee" })
    }
}

export const HandleEmployeeByEmployee = async (req, res) => {
    try {
        const employees = await Employee.findByOrganization(req.ORGID)
        const employee = employees.find(emp => emp.id === req.EMid)

        if (!employee) {
            return res.status(404).json({ success: false, message: "Employee not found", type: "EmployeeByEmployee" })
        }

        const employeeWithDetails = {
            id: employee.id,
            firstname: employee.firstname,
            lastname: employee.lastname,
            email: employee.email,
            contactnumber: employee.contactnumber,
            departmentId: employee.departmentId,
            attendanceId: employee.attendanceId,
            noticeIds: employee.noticeIds || [],
            salaryIds: employee.salaryIds || [],
            leaverequestIds: employee.leaverequestIds || [],
            generaterequestIds: employee.generaterequestIds || []
        }

        if (employee.departmentId) {
            const department = await Department.findById(employee.departmentId)
            employeeWithDetails.department = department ? {
                id: department.id,
                name: department.name
            } : null
        }

        return res.status(200).json({ success: true, data: employeeWithDetails, type: "EmployeeByEmployee" })
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message, type: "EmployeeByEmployee" })
    }
}

export const HandleUpdateEmployee = async (req, res) => {
    try {
        const { employeeId } = req.params
        const { firstname, lastname, email, contactnumber, department } = req.body

        if (!employeeId) {
            return res.status(400).json({ success: false, message: "Employee ID is required", type: "EmployeeUpdate" })
        }

        const employees = await Employee.findByOrganization(req.ORGID)
        const employee = employees.find(emp => emp.id === employeeId)

        if (!employee) {
            return res.status(404).json({ success: false, message: "Employee not found", type: "EmployeeUpdate" })
        }

        const updates = {}
        if (firstname) updates.firstname = firstname
        if (lastname) updates.lastname = lastname
        if (email) updates.email = email
        if (contactnumber) updates.contactnumber = contactnumber
        if (department) {
            if (employee.departmentId) {
                await Department.removeEmployee(employee.departmentId, employeeId)
            }
            await Department.addEmployee(department, employeeId)
            updates.departmentId = department
        }

        const updatedEmployee = await Employee.updateById(employeeId, updates)

        return res.status(200).json({ success: true, message: "Employee updated successfully", data: updatedEmployee, type: "EmployeeUpdate" })

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message, type: "EmployeeUpdate" })
    }
}

export const HandleDeleteEmployee = async (req, res) => {
    try {
        const { employeeId } = req.params
        const employee = await Employee.findById(employeeId)

        if (!employee) {
            return res.status(404).json({ success: false, message: "Employee not found", type: "EmployeeDelete" })
        }

        if (employee.departmentId) {
            await Department.removeEmployee(employee.departmentId, employeeId)
        }

        await Organization.removeEmployee(req.ORGID, employeeId)

        await Employee.deleteById(employeeId)

        return res.status(200).json({ success: true, message: "Employee deleted successfully", type: "EmployeeDelete" })

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message, type: "EmployeeDelete" })
    }
}