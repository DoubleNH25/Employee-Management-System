import { Employee } from "../models/firestore/Employee.firestore.js"
import { Department } from "../models/firestore/Department.firestore.js";
import { Task } from "../models/firestore/Task.firestore.js";

export const HandleGetEmployeeProfile = async (req, res) => {
    try {
        const employeeId = req.EMid;
        
        const employee = await Employee.findById(employeeId);
        
        if (!employee) {
            return res.status(404).json({
                success: false,
                message: "Employee not found"
            });
        }

        const { password, accessCode, accessCodeExpires, verificationtoken, verificationtokenexpires, loginOTP, loginOTPExpires, ...profileData } = employee;

        if (employee.departmentId) {
            const department = await Department.findById(employee.departmentId);
            if (department) {
                profileData.department = {
                    id: department.id,
                    name: department.name,
                    description: department.description
                };
                profileData.departmentName = department.name;
            }
        }

        return res.status(200).json({
            success: true,
            data: profileData,
            message: "Profile retrieved successfully"
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: error.message,
            message: "Failed to retrieve profile"
        });
    }
};

export const HandleUpdateEmployeeProfile = async (req, res) => {
    try {
        const employeeId = req.EMid;
        const { firstname, lastname, phone } = req.body;

        if (!firstname && !lastname && !phone) {
            return res.status(400).json({
                success: false,
                message: "At least one field is required to update"
            });
        }

        const updateData = {};
        if (firstname) updateData.firstname = firstname;
        if (lastname) updateData.lastname = lastname;
        if (phone) updateData.phone = phone;

        const updatedEmployee = await Employee.updateById(employeeId, updateData);

        if (!updatedEmployee) {
            return res.status(404).json({
                success: false,
                message: "Employee not found"
            });
        }

        const { password, accessCode, accessCodeExpires, verificationtoken, verificationtokenexpires, loginOTP, loginOTPExpires, ...profileData } = updatedEmployee;

        return res.status(200).json({
            success: true,
            data: profileData,
            message: "Profile updated successfully"
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: error.message,
            message: "Failed to update profile"
        });
    }
};

export const HandleGetEmployeeTasks = async (req, res) => {
    try {
        const employeeId = req.EMid;

        const tasks = await Task.findByEmployee(employeeId);

        return res.status(200).json({
            success: true,
            data: tasks,
            message: "Tasks retrieved successfully"
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: error.message,
            message: "Failed to retrieve tasks"
        });
    }
};

export const HandleUpdateTaskStatus = async (req, res) => {
    try {
        const employeeId = req.EMid;
        const { taskId } = req.params;
        const { status } = req.body;

        const validStatuses = ['pending', 'in-progress', 'completed'];
        if (!status || !validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid status. Must be one of: pending, in-progress, completed"
            });
        }

        const task = await Task.findById(taskId);
        if (!task) {
            return res.status(404).json({
                success: false,
                message: "Task not found"
            });
        }

        if (task.assignedTo !== employeeId) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to update this task"
            });
        }

        const updatedTask = await Task.update(taskId, { status });

        return res.status(200).json({
            success: true,
            data: updatedTask,
            message: "Task status updated successfully"
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: error.message,
            message: "Failed to update task status"
        });
    }
};

export const HandleEmployeeLogout = async (req, res) => {
    try {
        res.clearCookie("EMtoken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict"
        });

        return res.status(200).json({
            success: true,
            message: "Logged out successfully"
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: error.message,
            message: "Failed to logout"
        });
    }
};
