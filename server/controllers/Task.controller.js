import { Task } from "../models/firestore/Task.firestore.js";
import { Employee } from "../models/firestore/Employee.firestore.js";

export const HandleGetAllTasks = async (req, res) => {
    try {
        const tasks = await Task.findByOrganization(req.ORGID);
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

export const HandleGetEmployeeTasks = async (req, res) => {
    try {
        const { employeeId } = req.params;
        const tasks = await Task.findByEmployee(employeeId);
        return res.status(200).json({ 
            success: true, 
            data: tasks,
            message: "Employee tasks retrieved successfully" 
        });
    } catch (error) {
        return res.status(500).json({ 
            success: false, 
            error: error.message, 
            message: "Failed to retrieve employee tasks" 
        });
    }
};

export const HandleGetTaskById = async (req, res) => {
    try {
        const { taskId } = req.params;
        const task = await Task.findById(taskId);
        
        if (!task) {
            return res.status(404).json({ 
                success: false, 
                message: "Task not found" 
            });
        }
        
        return res.status(200).json({ 
            success: true, 
            data: task,
            message: "Task retrieved successfully" 
        });
    } catch (error) {
        return res.status(500).json({ 
            success: false, 
            error: error.message, 
            message: "Failed to retrieve task" 
        });
    }
};

export const HandleCreateTask = async (req, res) => {
    try {
        const { title, description, assignedTo, priority, dueDate } = req.body;
        
        if (!title || !description || !assignedTo) {
            return res.status(400).json({ 
                success: false, 
                message: "Title, description, and assignedTo are required" 
            });
        }
        
        const employee = await Employee.findById(assignedTo);
        if (!employee) {
            return res.status(404).json({ 
                success: false, 
                message: "Employee not found" 
            });
        }
        
        if (employee.organizationId !== req.ORGID) {
            return res.status(403).json({ 
                success: false, 
                message: "Cannot assign task to employee from different organization" 
            });
        }
        
        const taskData = {
            title,
            description,
            assignedTo,
            assignedBy: req.HRid,
            priority: priority || 'medium',
            dueDate: dueDate ? new Date(dueDate) : null,
            organizationId: req.ORGID,
            status: 'pending'
        };
        
        const task = await Task.create(taskData);
        
        return res.status(201).json({ 
            success: true, 
            data: task,
            message: "Task created successfully" 
        });
    } catch (error) {
        return res.status(500).json({ 
            success: false, 
            error: error.message, 
            message: "Failed to create task" 
        });
    }
};

export const HandleUpdateTask = async (req, res) => {
    try {
        const { taskId } = req.params;
        const updateData = req.body;
        
        const existingTask = await Task.findById(taskId);
        if (!existingTask) {
            return res.status(404).json({ 
                success: false, 
                message: "Task not found" 
            });
        }
        
        if (existingTask.organizationId !== req.ORGID) {
            return res.status(403).json({ 
                success: false, 
                message: "Cannot update task from different organization" 
            });
        }
        
        if (updateData.assignedTo && updateData.assignedTo !== existingTask.assignedTo) {
            const employee = await Employee.findById(updateData.assignedTo);
            if (!employee) {
                return res.status(404).json({ 
                    success: false, 
                    message: "Employee not found" 
                });
            }
            
            if (employee.organizationId !== req.ORGID) {
                return res.status(403).json({ 
                    success: false, 
                    message: "Cannot assign task to employee from different organization" 
                });
            }
        }
        
        if (updateData.dueDate) {
            updateData.dueDate = new Date(updateData.dueDate);
        }
        
        const updatedTask = await Task.update(taskId, updateData);
        
        return res.status(200).json({ 
            success: true, 
            data: updatedTask,
            message: "Task updated successfully" 
        });
    } catch (error) {
        return res.status(500).json({ 
            success: false, 
            error: error.message, 
            message: "Failed to update task" 
        });
    }
};

export const HandleDeleteTask = async (req, res) => {
    try {
        const { taskId } = req.params;
        
        const existingTask = await Task.findById(taskId);
        if (!existingTask) {
            return res.status(404).json({ 
                success: false, 
                message: "Task not found" 
            });
        }
        
        if (existingTask.organizationId !== req.ORGID) {
            return res.status(403).json({ 
                success: false, 
                message: "Cannot delete task from different organization" 
            });
        }
        
        await Task.delete(taskId);
        
        return res.status(200).json({ 
            success: true, 
            message: "Task deleted successfully" 
        });
    } catch (error) {
        return res.status(500).json({ 
            success: false, 
            error: error.message, 
            message: "Failed to delete task" 
        });
    }
};

export const HandleAddTaskComment = async (req, res) => {
    try {
        const { taskId } = req.params;
        const { text } = req.body;
        
        if (!text) {
            return res.status(400).json({ 
                success: false, 
                message: "Comment text is required" 
            });
        }
        
        const existingTask = await Task.findById(taskId);
        if (!existingTask) {
            return res.status(404).json({ 
                success: false, 
                message: "Task not found" 
            });
        }
        
        if (existingTask.organizationId !== req.ORGID) {
            return res.status(403).json({ 
                success: false, 
                message: "Cannot comment on task from different organization" 
            });
        }
        
        const comment = {
            text,
            authorId: req.HRid,
            authorType: 'hr'
        };
        
        const updatedTask = await Task.addComment(taskId, comment);
        
        return res.status(200).json({ 
            success: true, 
            data: updatedTask,
            message: "Comment added successfully" 
        });
    } catch (error) {
        return res.status(500).json({ 
            success: false, 
            error: error.message, 
            message: "Failed to add comment" 
        });
    }
};

export const HandleGetTaskStatistics = async (req, res) => {
    try {
        const statistics = await Task.getStatistics(req.ORGID);
        return res.status(200).json({ 
            success: true, 
            data: statistics,
            message: "Task statistics retrieved successfully" 
        });
    } catch (error) {
        return res.status(500).json({ 
            success: false, 
            error: error.message, 
            message: "Failed to retrieve task statistics" 
        });
    }
};