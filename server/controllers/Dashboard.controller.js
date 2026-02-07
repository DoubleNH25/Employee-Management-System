import { Employee } from "../models/firestore/Employee.firestore.js"
import { Department } from "../models/firestore/Department.firestore.js"
import { HumanResources } from "../models/firestore/HR.firestore.js"
import { Task } from "../models/firestore/Task.firestore.js"

export const HandleHRDashboard = async (req, res) => {
    try {
        const employeesData = await Employee.findByOrganization(req.ORGID)
        const departmentsData = await Department.findByOrganization(req.ORGID)
        const taskStatistics = await Task.getStatistics(req.ORGID)

        const dashboardData = {
            employees: employeesData.length,
            departments: departmentsData.length,
            totalUsers: employeesData.length + 1,
            tasks: taskStatistics
        }

        return res.status(200).json({ success: true, data: dashboardData })
    }
    catch (error) {
        return res.status(500).json({ success: false, error: error, message: "internal server error" })
    }
}